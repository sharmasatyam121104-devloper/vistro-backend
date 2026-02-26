
import { Schema, model } from "mongoose";
import { VideoInterface } from "./video.interface";

const videoSchema = new Schema<VideoInterface>(
  {

  },
  { timestamps: true }
);

const VideoModel = model<VideoInterface>("Video",videoSchema);

export default VideoModel;
