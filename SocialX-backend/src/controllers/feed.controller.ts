import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { Post } from "../models/post.model";
import { ApiResponse } from "../utils/api.response";
import { ApiError } from "../utils/api.error";

//Global feed
const globalFeed = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  let limit = parseInt(req.query.limit as string) || 10;
  limit = limit > 20 ? 20 : limit;
  const skip = (page - 1) * limit;

  const posts = await Post.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("author", "fullName userName avatarUrl")
    .lean();
  if (posts.length === 0) {
    throw new ApiError(404, "Posts not found for global feed");
  }

  const totalPosts = await Post.countDocuments();
  const hasMore = skip + posts.length < totalPosts;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { posts, hasMore, nextPage: hasMore ? page + 1 : null },
        "Global feed fetched successfully",
      ),
    );
});
//following feed
const followingFeed = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  let limit = parseInt(req.query.limit as string) || 10;
  limit = limit > 20 ? 20 : limit;
  const skip = (page - 1) * limit;
  const posts = await Post.find({ author: { $in: req.user.following } })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("author", "fullName userName avatarUrl");
  if (posts.length === 0) {
    throw new ApiError(404, "Posts not found for following feed");
  }
  const totalPosts = await Post.countDocuments({
    author: { $in: req.user.following },
  });
  const hasMore = skip + posts.length < totalPosts;
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { posts, hasMore, nextPage: hasMore ? page + 1 : null },
        "Following feed fetched successfully",
      ),
    );
});

export { globalFeed, followingFeed };
