
import { Document,  Types } from "mongoose";
import { VideoStatusEnum } from "./video.enum";
import { Request } from "express";

export interface ThumbnailInterface {
    high?: {
        path: string,
        width: number,
        height: number,
    },
    medium?: {
        path: string,
        width: number,
        height: number,
    },
    low?: {
        path: string,
        width: number,
        height: number,
    },
}

export interface VideoInterface extends Document {
    _id: Types.ObjectId
    user: Types.ObjectId
    title: string
    description: string
    size: number
    duration: number
    path: string
    status: VideoStatusEnum
    thumbnail: ThumbnailInterface
}

export interface AuthRequest extends Request{
    user?: {
        id: string,
        fullName: string,
        email: string,
        mobile: string
    }
}

export interface PaginationInterface {
    total: number
    data: any[]
}