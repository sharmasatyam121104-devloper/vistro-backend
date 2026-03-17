
import { Router} from 'express'
import { createThumbanil, createVideo, fetchVideo, getVideoStreamUrl, thumbnailWebhook, videoTranscodingWebhook } from './video.controller'
import { AuthMiddleware, DtoMiddleware, WebhookGuardMiddleware } from './video.middleware'
import { createVideoDtoSchema } from './video.dto'

const VideoRouter = Router()

VideoRouter.post('/', AuthMiddleware, DtoMiddleware(createVideoDtoSchema), createVideo)
VideoRouter.get('/', AuthMiddleware, fetchVideo)
VideoRouter.post('/thumbnail', AuthMiddleware, createThumbanil)
VideoRouter.post('/stream', getVideoStreamUrl)


VideoRouter.post("/webhook/transcoding", WebhookGuardMiddleware, videoTranscodingWebhook)
VideoRouter.post("/webhook/thumbnail",  thumbnailWebhook)

export default VideoRouter
