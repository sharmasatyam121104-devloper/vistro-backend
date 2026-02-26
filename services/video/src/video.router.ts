
import { Router, Request, Response } from 'express'

const VideoRouter = Router()

VideoRouter.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from video service" })
})

export default VideoRouter
