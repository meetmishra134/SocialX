import mongoose, { Document, Schema } from "mongoose";

export interface ICommunity extends Document {
  name: string;
  description: string;
  avatar: {
    url: string;
    publicId: string;
  };
  creator: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  membersCount: number;
  postsCount: number;
  createdAt: Date;
  updatedAt: Date;
}
const communitySchema = new Schema<ICommunity>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 3,
      maxlength: 50,
    },
    description: {
      type: String,
      maxlength: 200,
    },
    avatar: {
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    membersCount: {
      type: Number,
      default: 1,
    },
    postsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);
export const Community = mongoose.model<ICommunity>(
  "Community",
  communitySchema,
);
