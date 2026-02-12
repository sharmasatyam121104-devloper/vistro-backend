
import { Schema, model } from "mongoose";
import { BucketInterface } from "./bucket.interface";

const bucketSchema = new Schema<BucketInterface>(
  {

  },
  { timestamps: true }
);

const BucketModel = model<BucketInterface>("Bucket",bucketSchema);

export default BucketModel;
