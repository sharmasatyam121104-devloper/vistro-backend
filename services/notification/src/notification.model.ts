
import { Schema, model } from "mongoose";
import { NotificationInterface } from "./notification.interface";

const notificationSchema = new Schema<NotificationInterface>(
  {

  },
  { timestamps: true }
);

const NotificationModel = model<NotificationInterface>("Notification",notificationSchema);

export default NotificationModel;
