import { NextFunction, Request, Response } from "express";

export const DtoMiddleware = (schema: any)=>(req: Request, res: Response, next: NextFunction)=>{
    const result = schema.safeParse(req.body)
   
    if(!result.success) {
        res.status(400).json({message: "Validation failed", errors: result.error.format()})
        return
    }

    req.body = result.data
    next()
}

export const IscMiddleware = (req: Request, res: Response, next: NextFunction)=>{
    try {
        const apiKey = req.headers['x-api-key']

        if(!apiKey) {
            throw new Error("Unauthorized")
        }

        if(apiKey !== process.env.API_KEY) {
            throw new Error("Unauthorized")
        }

        next()
    } 
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message})
        }
    }
}