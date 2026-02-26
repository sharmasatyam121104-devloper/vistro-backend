
import { Schema, model } from "mongoose";
import { v4 as uuid } from "uuid";
import moment from "moment";
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

authSchema.pre('save', function(){
  this.refreshToken = uuid()
  this.refreshTokenExpiredAt = moment().add(1, 'M').toDate()
})

const AuthModel = model<AuthInterface>("Auth",authSchema);

export default AuthModel;
