
import { Document } from "mongoose";

export interface AuthInterface extends Document {
    fullname: string,
    email: string,
    mobile: string,
    refreshToken: string,
    refreshTokenExpiredAt: Date,
}

export interface MessageInterface {
    message: string
}

export interface VerifyOtpInterface extends MessageInterface {
    accessToken: string
    refreshToken: string
}
