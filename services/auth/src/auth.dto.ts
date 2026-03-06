import { email, z } from 'zod'

export const signupDtoSchema = z.object({
    fullname: z.string().min(1, "Fullname is required!"),
    email: z.email("Enter a valid email."),
    mobile: z.string().min(8, "Enter a valid mobile number")
}).strict()


export const sendOtpDtoSchema = z.object({
    mobile: z.string().min(8, "Enter a valid mobile number")
}).strict()


export const verifyOtpDtoSchema = z.object({
    mobile: z.string().min(8, "Enter a valid mobile number"),
    otp: z.string().regex(/^\d{4}$/, "OTP must be 4 digits")
}).strict()

export const verifyTokenDtoSchema = z.object({
    token: z.string().min(1, "Token is required")
}).strict()


export type SendOtpDto = z.infer<typeof sendOtpDtoSchema>
export type SignupDto = z.infer<typeof signupDtoSchema>
export type VerifyOtpDto = z.infer<typeof verifyOtpDtoSchema>
export type VerifyTokenDto = z.infer<typeof verifyTokenDtoSchema>