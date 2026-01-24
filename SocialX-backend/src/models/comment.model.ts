import mongoose, { Schema, Document } from "mongoose";

export interface IComments extends Document {
  author: mongoose.Types.ObjectId;
  text: String;
  likes: mongoose.Types.ObjectId[];
  post: mongoose.Types.ObjectId;
}

const commentSchema = new mongoose.Schema<IComments>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
      maxlength: 200,
      required: true,
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

commentSchema.index({ createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });

export const Comment = mongoose.model<IComments>("Comment", commentSchema);
