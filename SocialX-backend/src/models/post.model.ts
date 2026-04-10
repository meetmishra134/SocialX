import mongoose, { Document, Schema } from "mongoose";

export interface IPosts extends Document {
  author: mongoose.Types.ObjectId;
  text: string;
  images: { url: string; publicId: string }[];
  likes: mongoose.Types.ObjectId[];
}

const postSchema = new mongoose.Schema<IPosts>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 400,
      default: "",
    },
    images: {
      type: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
        },
      ],
      validate: {
        validator: function arrayLimit(val: any) {
          return val.length <= 4;
        },
      },
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
export const Post = mongoose.model("Post", postSchema);
