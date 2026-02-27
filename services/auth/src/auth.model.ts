
import { Schema, model } from "mongoose";
import { AuthInterface } from "./auth.interface.js";

const authSchema = new Schema<AuthInterface>(
  {
    mobile: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    refreshTokenExpiredAt: {
      type: Date
    }
  },
  { timestamps: true }
);


const AuthModel = model<AuthInterface>("Auth",authSchema);

export default AuthModel;
