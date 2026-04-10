import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api.error";
import { Post } from "../models/post.model";
import { ApiResponse } from "../utils/api.response";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { Comment } from "../models/comment.model";
import fs from "fs/promises";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "../server";

//* Create a post (Text || Image)
const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { _id: loggedInUserId, userName } = req.user;
  const text = req.body.text?.trim();
  const files = req.files as Express.Multer.File[] | undefined;

  const hasText = Boolean(text);
  const hasImages = Boolean(files && files.length > 0);
  if (!hasText && !hasImages) {
    throw new ApiError(400, "Post cannot be empty Add text or images");
  }

  let postImages: { url: string; publicId: string }[] = [];
  if (hasImages && files) {
    const cloudinaryResponses = await Promise.all(
      files.map(async (file) => {
        try {
          const result = await uploadToCloudinary(file.path, {
            folder: `posts/user-${userName}`,
          });
          await fs.unlink(file.path).catch(() => {});
          return result as UploadApiResponse;
        } catch (error) {
          await fs.unlink(file.path).catch(() => {});
          throw new ApiError(500, "Error uploading images to Cloudinary");
        }
      }),
    );
    postImages = cloudinaryResponses.map((img) => ({
      url: img.secure_url,
      publicId: img.public_id,
    }));
  }

  const post = await Post.create({
    text: hasText ? text : null,
    images: postImages,
    author: loggedInUserId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { post }, "Post created successfully"));
});

//* View single post
const viewPost = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;
  const post = await Post.findById(postId).populate(
    "author",
    "userName fullName avatarUrl",
  );
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { post }, "Post fetched successfully"));
});

//* View all posts
const viewAllPosts = asyncHandler(async (req: Request, res: Response) => {
  const posts = await Post.find().populate("author", "userName avatarUrl");
  return res
    .status(200)
    .json(new ApiResponse(200, { posts }, "Posts fetched successfully"));
});

//* Delete a post
const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const { _id: loggedInUserId } = req.user;
  const { postId } = req.params;
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  if (post.author.toString() !== loggedInUserId.toString()) {
    throw new ApiError(403, "Unauthorized to delete this post");
  }

  if (post.images && post.images.length > 0) {
    await Promise.all(
      post.images.map(async (image: any) => {
        if (image.publicId) {
          await cloudinary.uploader
            .destroy(image.publicId, { resource_type: "image" })
            .catch(() => {
              console.error(
                "Failed to delete image from Cloudinary",
                image.publicId,
              );
            });
        }
      }),
    );
  }

  await post.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Post deleted Successfully"));
});

//* Like or dislike a post
const likeDislikePost = asyncHandler(async (req: Request, res: Response) => {
  const { _id: loggedInUserId } = req.user;
  const { postId } = req.params;
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  const hasLiked = post.likes.includes(loggedInUserId);
  if (hasLiked) {
    post.likes = post.likes.filter(
      (userId) => userId.toString() !== loggedInUserId.toString(),
    );
  } else {
    post.likes.push(loggedInUserId);
  }
  await post.save();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { data: post },
        hasLiked ? "Post disliked successfully" : "Post liked successfully",
      ),
    );
});

//* Comment on a post
const commentOnPost = asyncHandler(async (req: Request, res: Response) => {
  const { _id: loggedInUserId } = req.user;
  const { postId } = req.params;
  const { comment } = req.body;

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const newComment = await Comment.create({
    author: loggedInUserId,
    post: postId,
    text: comment,
  });
  await newComment.save();
  return res
    .status(201)
    .json(
      new ApiResponse(201, { data: newComment }, "Comment added successfully"),
    );
});

//* Delete Comment on a post
const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const { _id: loggedInUserId } = req.user;
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  if (comment.author.toString() !== loggedInUserId.toString()) {
    throw new ApiError(403, "Unauthorized to delete this comment");
  }
  await Comment.findOneAndDelete({
    _id: commentId,
    author: loggedInUserId,
  });
  res.status(200).json(new ApiResponse(200, "Comment deleted successfully"));
});

//* View comment on a post
const viewComments = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;
  const comments = await Comment.find({ post: postId }).populate(
    "author",
    "userName",
    "avatarUrl",
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, { data: comments }, "comments fetched successfully"),
    );
});

export {
  createPost,
  deletePost,
  likeDislikePost,
  commentOnPost,
  deleteComment,
  viewComments,
  viewPost,
  viewAllPosts,
};
