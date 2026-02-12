
import { Schema, model } from "mongoose";
import { AuthInterface } from "./auth.interface";

const authSchema = new Schema<AuthInterface>(
  {

  },
  { timestamps: true }
);

const AuthModel = model<AuthInterface>("Auth",authSchema);

export default AuthModel;
