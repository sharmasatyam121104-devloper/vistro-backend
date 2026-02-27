import { Schema, model } from "mongoose";
import { AuthInterface } from "./auth.interface.js";
import moment from "moment";
import {v4 as uuid} from "uuid";

const authSchema = new Schema<AuthInterface>(
  {
    fullname: {
      type: String,
      required: true, 
    },
    email: {
      type: String,
      required: true, 
    },
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

authSchema.pre('save', function(){
  this.refreshToken = uuid()
  this.refreshTokenExpiredAt = moment().add(1, 'M').toDate()
})

const AuthModel = model<AuthInterface>("Auth",authSchema);

export default AuthModel;
