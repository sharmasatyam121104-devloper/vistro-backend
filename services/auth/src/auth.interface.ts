
import { Document } from "mongoose";

export interface AuthInterface extends Document {
    mobile: string,
    refreshToken: string,
    refreshTokenExpiredAt: Date,
}
