import { Router, Request, Response } from 'express'
import { resendOtp, sendOtp, signup, verifyOtp, verifyToken } from './auth.controller.js'
import { DtoMiddleware, IscMiddleware } from './auth.middleware.js'
import { sendOtpDtoSchema, signupDtoSchema, verifyOtpDtoSchema, verifyTokenDtoSchema } from './auth.dto.js'

const AuthRouter = Router()

AuthRouter.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from auth service" })
})

AuthRouter.post('/send-otp', DtoMiddleware(sendOtpDtoSchema), sendOtp)
AuthRouter.post('/verify-otp', DtoMiddleware(verifyOtpDtoSchema), verifyOtp)
AuthRouter.post('/resend-otp', DtoMiddleware(sendOtpDtoSchema), resendOtp)
AuthRouter.post('/signup', DtoMiddleware(signupDtoSchema), signup)
AuthRouter.post('/verify-token',IscMiddleware ,DtoMiddleware(verifyTokenDtoSchema), verifyToken)

export default AuthRouter
