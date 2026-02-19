import mongoose, { Schema, Document } from "mongoose";

export interface IFollowRequest extends Document {
  requester: mongoose.Types.ObjectId;
  users: [mongoose.Types.ObjectId];
  status: "pending" | "accepted" | "rejected";
}
const followRequestSchema = new mongoose.Schema<IFollowRequest>(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    users: {
      type: [Schema.Types.ObjectId],
      required: true,
      validate: {
        validator: (val: mongoose.Types.ObjectId[]) => val.length == 2,
        message: "User array must contain two user Id's",
      },
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
