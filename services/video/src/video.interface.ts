
import { Document,  Types } from "mongoose";
import { VideoStatusEnum } from "./video.enum";
import { Request } from "express";

export interface VideoInterface extends Document {
    user: Types.ObjectId
    title: string
    description: string
    size: number
    duration: number
    path: string
    status: VideoStatusEnum
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