import { Request, Response } from "express";
import * as videoService from './video.service'
import { AuthRequest } from "./video.interface";

export const createVideo = async (req: AuthRequest, res: Response)=>{
    try {
        const userId = req.user?.id
        if(!userId) {
            return null
        }

        const video = await videoService.createVideo(userId, req.body)
        res.json(video)
    } 
    catch (error) {
        if(error instanceof Error) {
            res.status(200).json({message: error.message})
        }    
    }
}


export const fetchVideo = async (req: AuthRequest, res: Response)=>{
    try {
        const userId = req.user?.id
        if(!userId) {
            return null
        }

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 12


        const video = await videoService.fetchVideo(userId, page, limit)
        res.json(video)
    } 
    catch (error) {
        if(error instanceof Error) {
            res.status(200).json({message: error.message})
        }    
    }
}


export const videoTranscodingWebhook = async (req: Request, res: Response)=>{
    try {
        const video = await videoService.videoTranscodingWebhook(req.body)
        res.json(video)
    }
    catch(err)
    {
        if(err instanceof Error)
            res.status(200).json({message: err.message})
    }
}

export const thumbnailWebhook = async (req: Request, res: Response)=>{
    try {
        const video = await videoService.thumbnailWebhook(req.body)
        res.json(video)
    }
    catch(err)
    {
        if(err instanceof Error)
            res.status(200).json({message: err.message})
    }
}

export const getVideoStreamUrl = async (req: Request, res: Response)=>{
    try {
        const stream = await videoService.getVideoStreamUrl(req.body)
        res.json(stream)
    }
    catch(err)
    {
        if(err instanceof Error)
            res.status(200).json({message: err.message})
    }
}

export const createThumbanil = async (req: AuthRequest, res: Response)=>{
    try {
        const userId = req.user?.id
        if(!userId) {
            return null
        }

        const thumbnails = await videoService.cretaeThumbnail(userId, req.body)
        res.json(thumbnails)
    } 
    catch (error) {
        if(error instanceof Error) {
            res.status(200).json({message: error.message})
        }    
    }
}