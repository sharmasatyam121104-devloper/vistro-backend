import fs from 'fs'
import VideoModel from './video.model';
import { PaginationInterface, VideoInterface } from './video.interface';
import { CreateVideoDto } from './video.dto';
import { Types } from 'mongoose';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from "crypto";

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
    body.path = path
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
    const video = await VideoModel.findByIdAndUpdate(videoId, {status}, {new: true})
    if(!video) {
        throw new Error("Failed to find video id")
    }

    return {message: "Video upddated."}
}