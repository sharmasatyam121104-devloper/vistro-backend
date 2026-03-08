
import { Router} from 'express'
import { createVideo, fetchVideo, videoTranscodingWebhook } from './video.controller'
import { AuthMiddleware, DtoMiddleware, WebhookGuardMiddleware } from './video.middleware'
import { createVideoDtoSchema } from './video.dto'

const VideoRouter = Router()

VideoRouter.post('/', AuthMiddleware, DtoMiddleware(createVideoDtoSchema), createVideo)
VideoRouter.get('/', AuthMiddleware, fetchVideo)

VideoRouter.post("/webhook/transcoding", WebhookGuardMiddleware, videoTranscodingWebhook)

export default VideoRouter
