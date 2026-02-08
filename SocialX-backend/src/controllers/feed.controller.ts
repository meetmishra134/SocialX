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
    .populate("author", "userName,avatarUrl")
    .lean();
  if (posts.length === 0) {
    throw new ApiError(404, "Posts not found for global feed");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, { data: posts }, "Global feed fetched successfully"),
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
    .populate("author", "userName,avatarUrl");
  if (posts.length === 0) {
    throw new ApiError(404, "Posts not found for following feed");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { data: posts },
        "Following feed fetched successfully",
      ),
    );
});

export { globalFeed, followingFeed };
