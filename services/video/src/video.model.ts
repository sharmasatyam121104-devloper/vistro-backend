
import mongoose, { Schema, model } from "mongoose";
import { VideoInterface } from "./video.interface";
import { VideoStatusEnum } from "./video.enum";
import { required } from "zod/mini";

const videoSchema = new Schema<VideoInterface>(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
    },
    size: {
      type: Number,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(VideoStatusEnum),
      default: VideoStatusEnum.draft
    }

  },
  { timestamps: true }
);

const VideoModel = model<VideoInterface>("Video",videoSchema);

export default VideoModel;
