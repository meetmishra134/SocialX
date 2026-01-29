import mongoose, { Schema, Document } from "mongoose";

export interface IFollowRequest extends Document {
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
}
const followRequestSchema = new mongoose.Schema<IFollowRequest>(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

followRequestSchema.index({ from: 1, to: 1 }, { unique: true });

export const FollowRequest = mongoose.model<IFollowRequest>(
  "FollowRequest",
  followRequestSchema,
);
