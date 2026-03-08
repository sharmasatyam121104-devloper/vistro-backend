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

const genrateSignedUrlForUpload = async(path: string)=>{
    const cmd = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: path
    })
    const url = await getSignedUrl(s3, cmd, {expiresIn: FIFTEEN_MINUTE})
    return url
}

export const createVideo = async(userId: string ,body: CreateVideoDto): Promise<{uploadUrl: string, video: VideoInterface}>=>{
    const fileName = crypto.randomBytes(8).toString("hex")
    const path = `originals/${userId}/${fileName}.mp4`
    body.path = path
    let user = new Types.ObjectId(userId)
        const [uploadUrl, video] = await Promise.all([
            genrateSignedUrlForUpload(path),
            VideoModel.create({...body, user})
        ])
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

export const videoTranscodingWebhook = (body: any)=>{
    console.log("Request recived from lambda");
    fs.writeFileSync("video.json", JSON.stringify(body, null, 2))
    return {message: 'success'}
}