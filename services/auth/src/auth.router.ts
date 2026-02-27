import { Router, Request, Response } from 'express'
import { resendOtp, sendOtp, signup, verifyOtp } from './auth.controller.js'

const AuthRouter = Router()

AuthRouter.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from auth service" })
})

AuthRouter.post('/send-otp', sendOtp)
AuthRouter.post('/verify-otp', verifyOtp)
AuthRouter.post('/resend-otp', resendOtp)
AuthRouter.post('/signup', signup)

export default AuthRouter
