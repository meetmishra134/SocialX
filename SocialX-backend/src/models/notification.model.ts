import mongoose from "mongoose";

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  type: "like" | "comment" | "follow";
  post?: mongoose.Types.ObjectId;
  isRead: boolean;
}

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "comment", "follow"],
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema,
);
