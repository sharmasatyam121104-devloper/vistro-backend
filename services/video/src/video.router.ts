
import { Router, Request, Response } from 'express'
import { videoTranscodingWebhook } from './video.service'
import { createVideo, fetchVideo } from './video.controller'
import { AuthMiddleware, DtoMiddleware } from './video.middleware'
import { createVideoDtoSchema } from './video.dto'

const VideoRouter = Router()

VideoRouter.post('/', AuthMiddleware, DtoMiddleware(createVideoDtoSchema), createVideo)
VideoRouter.get('/', AuthMiddleware, fetchVideo)

// VideoRouter.post("/webhook/transcoding", WebhookGuardMiddleware, videoTranscodingWebhook)

export default VideoRouter
