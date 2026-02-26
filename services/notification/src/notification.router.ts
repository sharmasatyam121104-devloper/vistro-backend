
import { Router, Request, Response } from 'express'

const NotificationRouter = Router()

NotificationRouter.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from notification service" })
})

export default NotificationRouter
