import mongoose, { Document, Schema } from "mongoose";

export interface IPosts extends Document {
  author: mongoose.Types.ObjectId;
  text: string;
  images: string[];
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
      maxlength: 500,
      default: "",
    },
    images: {
      type: [String],
      default: [],
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
// postSchema.pre("save", function () {
//   if (this.text) {
//     this.text = this.text.trim();
//   }
// });

postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
export const Post = mongoose.model("Post", postSchema);
