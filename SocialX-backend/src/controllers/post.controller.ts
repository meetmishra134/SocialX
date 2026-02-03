import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api.error";
import { Post } from "../models/post.model";
import { ApiResponse } from "../utils/api.response";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

//* Create a post (Text || Image)
const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { _id: loggedInUserId, userName } = req.user;
  const text = req.body.text?.trim();
  const files = req.files as Express.Multer.File[] | undefined;

  const hasText = Boolean(text);
  const hasImages = Boolean(files && files.length > 0);
  if (!hasText && !hasImages) {
    throw new ApiError(400, "Post cannot be empty Add text or image");
  }
  const imageUrl = await Promise.all(
    files.map((file) => uploadToCloudinary(file.path, file.filename, userName)),
  );
  const post = await Post.create({
    text: hasText ? text : null,
    images: imageUrl.map((img: any) => img.secure_url),
    author: loggedInUserId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { data: post }, "Post created successfully"));
});

//* Delete a post

//* Like a post

//* Comment on a post

//* Delete Comment on a

//* View comment on a post

export { createPost };
