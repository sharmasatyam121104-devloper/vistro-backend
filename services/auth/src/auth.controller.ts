import { Request, Response } from "express"
import * as authService from './auth.service.js'

export const signup = async(req: Request, res: Response)=>{
    try {
        const body = req.body
        const auth = await authService.signup(body)
        res.json(auth)
    } 
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message})
        }
    }
}

export const sendOtp = async(req: Request, res: Response)=>{
    try {
        const auth =  await authService.sendOtp(req.body)
        res.json(auth)
    } 
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message})
        }
    }
}


export const verifyOtp = async(req: Request, res: Response)=>{
    try {
        const auth =  await authService.verifyOtp(req.body)
        res.cookie("accessToken", auth.accessToken, {
            httpOnly: true,
            maxAge: Number(process.env.COOKIE_MAX_AGE),
            domain: process.env.CLIENT_DOMAIN,
            secure: process.env.NODE_ENV === "dev" ? false : true,
            sameSite: false
        })
        res.cookie("refreshToken", auth.refreshToken, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            domain: process.env.CLIENT_DOMAIN,
            secure: process.env.NODE_ENV === "dev" ? false : true,
            sameSite: false
        })

        res.json({message: "Login Success."})

    } 
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message})
        }
    }
}


export const resendOtp = async(req: Request, res: Response)=>{
    try {
        const auth =  await authService.resendOtp(req.body)
        res.json(auth)
    } 
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message})
        }
    }
}