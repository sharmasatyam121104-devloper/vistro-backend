
import { Router, Request, Response } from 'express'

const BucketRouter = Router()

BucketRouter.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from bucket service" })
})

export default BucketRouter
