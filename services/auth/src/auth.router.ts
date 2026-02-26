
import { Router, Request, Response } from 'express'

const AuthRouter = Router()

AuthRouter.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from auth service" })
})

export default AuthRouter
