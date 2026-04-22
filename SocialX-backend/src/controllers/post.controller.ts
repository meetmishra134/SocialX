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
import { User } from "../models/user.model";
import { io } from "../app";

//* Create a post (Text || Image)
const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { _id: loggedInUserId, userName } = req.user;
  const { text, topics } = req.body;
  const files = req.files as Express.Multer.File[] | undefined;

  const sanitizedTopics = Array.isArray(topics) ? topics.slice(0, 5) : [];

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
    topics: sanitizedTopics,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { post }, "Post created successfully"));
});

const searchPostByTopic = asyncHandler(async (req: Request, res: Response) => {
  const { topic } = req.query;
  if (!topic || typeof topic !== "string") {
    throw new ApiError(400, "Topic query parameter is required");
  }
  const posts = await Post.find({
    topics: { $regex: `^${topic}$`, $options: "i" },
  })
    .sort({ createdAt: -1 })
    .populate("author", "userName avatarUrl fullName");
  return res
    .status(200)
    .json(new ApiResponse(200, { posts }, "Posts fetched successfully"));
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
const getUserPosts = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const posts = await Post.find({ author: userId })
    .sort({ createdAt: -1 })
    .populate("author", "userName fullName avatarUrl");

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
  const post = await Post.findOne(
    { _id: postId, likes: loggedInUserId },
    { _id: 1 },
  );
  let updatedPost;
  if (post) {
    updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: loggedInUserId } },
      { new: true, select: "likes" },
    );
  } else {
    updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: loggedInUserId } },
      { new: true, select: "likes" },
    );
  }
  const payload = {
    postId,
    likes: updatedPost?.likes,
  };
  io.emit("like_updated", payload);
  return res
    .status(200)
    .json(
      new ApiResponse(200, payload, "Post like status updated successfully"),
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

  const comments = await Comment.create({
    author: loggedInUserId,
    post: postId,
    text: comment,
  });
  await comments.save();

  return res
    .status(201)
    .json(new ApiResponse(201, { comments }, "Comment added successfully"));
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
  const limit = parseInt(req.query.limit as string) || 3;
  const page = parseInt(req.query.page as string) || 1;
  const skip = (page - 1) * limit;
  const { postId } = req.params;
  const comments = await Comment.find({ post: postId })
    .populate("author", "userName fullName avatarUrl")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalComments = await Comment.countDocuments({ post: postId });
  const hasMore = skip + comments.length < totalComments;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { comments, hasMore, nextPage: hasMore ? page + 1 : null },
        "comments fetched successfully",
      ),
    );
});
const toggleBookmark = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { _id: loggedInUserId } = req.user;
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  const hasBookmarked = await User.exists({
    _id: loggedInUserId,
    bookmarks: postId,
  });
  if (hasBookmarked) {
    await User.findByIdAndUpdate(loggedInUserId, {
      $pull: { bookmarks: postId },
    });
  } else {
    await User.findByIdAndUpdate(loggedInUserId, {
      $addToSet: { bookmarks: postId },
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        hasBookmarked
          ? "Post removed from bookmarks successfully"
          : "Post added to bookmarks successfully",
      ),
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
  getUserPosts,
  toggleBookmark,
  searchPostByTopic,
};
