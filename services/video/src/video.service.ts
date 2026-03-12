import fs from 'fs'
import path from 'path'
import VideoModel from './video.model';
import { PaginationInterface, VideoInterface } from './video.interface';
import { CreateVideoDto } from './video.dto';
import { Types } from 'mongoose';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from "crypto";
import Redis from 'ioredis'
import { webhookQ } from './video.queue';
import {getSignedUrl as cloudSigner} from "@aws-sdk/cloudfront-signer"
import moment from 'moment';

const FIFTEEN_MINUTE = 900
const s3 = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!,
    }
})

const genrateSignedUrlForUpload = async(path: string, userId: string, videoId: string)=>{
    const cmd = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: path,
        Metadata: {
            user_id: userId,
            video_id: videoId
        }
    })
    const url = await getSignedUrl(s3, cmd, {expiresIn: FIFTEEN_MINUTE})
    return url
}

export const createVideo = async(userId: string ,body: CreateVideoDto): Promise<{uploadUrl: string, video: VideoInterface}>=>{
    const fileName = crypto.randomBytes(8).toString("hex")
    const path = `originals/${userId}/${fileName}.mp4`
    const streamPath = `streams/${userId}/${fileName}/${fileName}.m3u8`
    body.path = streamPath
    let user = new Types.ObjectId(userId)

    const video = await VideoModel.create({...body, user})
    const uploadUrl = await genrateSignedUrlForUpload(path, userId, video._id.toString())

    return {uploadUrl ,video}
}

export const fetchVideo = async (userId: string, page: number, limit: number): Promise<PaginationInterface>=>{
    const skip = (page-1) * limit

       const [total, videos] = await Promise.all([
            VideoModel.countDocuments({user: userId}),
            VideoModel.find({user: userId})
            .skip(skip)
            .limit(limit)
            .sort({createdAt: -1})
            .lean()
        ])

    return {total, data:videos}
}

const getVideoStatus = (status: string) => {
    if (status === "PROGRESSING") {
        return "converting";
    }

    if (status === "CANCELED" || status === "ERROR") {
        return "failed";
    }

    if (status === "COMPLETE") {
        return "published";
    }
}

export const videoTranscodingWebhook = async(body: any)=>{
    const videoId = body.userMetadata.video_id
    const status  = getVideoStatus(body.status)
    const options = {
        removeOnComplete: true,
        removeOnFailed: true,
        removeOnFail: true,
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000
        }
    }
    webhookQ.add("update-status", {videoId, status}, options)
    return {message: "Video status added to queue."}
}


export const upadteVideoStatus = async(videoId: string, status: string)=>{
    await VideoModel.updateOne({_id: videoId}, {status})
    return {message: "Video status upddated."}
}

const genrateCloudfrontSignedUrl = (streamPath: string)=>{
    const root = process.cwd()
    const privateFilePath = path.join(root, "private.pem")
    const key = fs.readFileSync(privateFilePath, "utf-8")
    const url = cloudSigner({
        url: `${process.env.CDN}/${streamPath}`,
        keyPairId: process.env.CDN_ID as string,
        dateLessThan: moment().add(60, "minutes").toISOString(),
        privateKey: key
    })

    return url
}

export const getVideoStreamUrl = (body: any)=>{
    const url = genrateCloudfrontSignedUrl(body.path)
    return {url}
}