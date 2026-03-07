import { Request, Response } from "express"
import { NextFunction } from "http-proxy-middleware/dist/types"

import axios from "axios"
import { AuthRequest } from "./video.interface"
axios.defaults.baseURL = process.env.GATEWAY_SERVER



export const DtoMiddleware = (schema: any)=>(req: Request, res: Response, next: NextFunction)=>{
    const result = schema.safeParse(req.body)
   
    if(!result.success) {
        res.status(400).json({message: "Validation failed", errors: result.error.format()})
        return
    }

    req.body = result.data
    next()
}

export const AuthMiddleware = async(req: AuthRequest, res: Response, next: NextFunction)=>{
    try {
        const accessToken = req.cookies.accessToken
        // const refreshToken = req.cookies.refreshToken

        if(!accessToken) {
            throw new Error("Unauthorized Access.")
        }

        const options = {
            headers: {
                'x-api-key': process.env.API_KEY
            }
        }

        const {data} = await axios.post("/auth/verify-token", {token: accessToken}, options)
        req.user = {
            id: data.id,
            mobile: data.mobile,
            email: data.email,
            fullName: data.fullName
        }
        next()
    } 
    catch (error) {
        if(error instanceof Error) {
            res.status(200).json({message: error.message})
        }      
    }
}