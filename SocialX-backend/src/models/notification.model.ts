import mongoose from "mongoose";
import { Document } from "mongoose";

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  type:
    | "like"
    | "comment"
    | "follow"
    | "likeComment"
    | "community_post"
    | "community_join";
  post?: mongoose.Types.ObjectId;
  comment?: mongoose.Types.ObjectId;
  communityId?: mongoose.Types.ObjectId;
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
      enum: [
        "like",
        "comment",
        "follow",
        "likeComment",
        "community_post",
        "community_join",
      ],
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    communityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
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
