import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { User } from "../models/user.model";
import { ApiError } from "../utils/api.error";
import { ApiResponse } from "../utils/api.response";
import { updateMeInput } from "../validators/user.validator";
import { Post } from "../models/post.model";
import { FollowRequest } from "../models/followRequest.model";

//* Get any user detail
const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { _id: loggedInUserId } = req.user;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(500, "User does not exist");
  }
  const isFollowing = user.following.includes(loggedInUserId);
  const isOwnProfile = loggedInUserId.toString() === userId;
  const userDetails = {
    _id: user._id,
    userName: user.userName,
    fullName: user.fullName,
    avatar: user.avatarUrl,
    bio: user.bio,
    followersCount: user.followers.length,
    followingCount: user.following.length,
    isOwnProfile: isOwnProfile,
    isFollowing: isFollowing,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: userDetails },
        "User details fetched successfully",
      ),
    );
});

//* Update or edit profile information

const editUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { _id: loggedInUserId } = req.user;
  const updates = req.body as updateMeInput;
  const user = await User.findByIdAndUpdate(loggedInUserId, updates, {
    new: true,
    runValidators: true,
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedUser: user },
        "Details updated successfully",
      ),
    );
});

//* Delete a user profile
const deleteUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { _id: loggedInUserId } = req.user;
  await Post.deleteMany({ author: loggedInUserId });
  await Post.deleteMany({ author: loggedInUserId });

  await User.updateMany(
    { followers: loggedInUserId },
    { $pull: { followers: loggedInUserId } },
  );
  await User.updateMany(
    { following: loggedInUserId },
    {
      $pull: { following: loggedInUserId },
    },
  );
  await User.findByIdAndDelete(loggedInUserId);
  return res
    .status(200)
    .json(new ApiResponse(200, "User deleted successfully"));
});

//* Send Follow Request
const sendFollowRequest = asyncHandler(async (req: Request, res: Response) => {
  const { toUserId } = req.params;
  const { _id: fromUserId } = req.user;

  if (fromUserId.toString() === toUserId) {
    throw new ApiError(400, "You cannot send follow request to yourself");
  }
  const toUser = await User.findById(toUserId);
  if (!toUser) {
    throw new ApiError(404, "User not found");
  }
  const alreadyFollowing = await User.exists({
    _id: fromUserId,
    following: toUserId,
  });
  if (alreadyFollowing) {
    throw new ApiError(400, "You are already following this user");
  }

  const existingRequest = await FollowRequest.findOne({
    $or: [
      { fromUserId: fromUserId, toUserId: toUserId },
      { fromUserId: toUserId, toUserId: fromUserId },
    ],
  });
  if (existingRequest) {
    throw new ApiError(400, "Follow request already exists");
  }

  const followRequest = await FollowRequest.create({
    fromUserId: fromUserId,
    toUserId: toUserId,
  });
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { data: followRequest },
        "Follow request sent successfully",
      ),
    );
});

//* View incoming requests
const viewIncomingRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id: loggedInUserId } = req.user;
    const requests = await FollowRequest.find({
      toUserId: loggedInUserId,
      status: "pending",
    })
      .populate("fromUserId", ["firstName", "userName", "avatarUrl"])
      .populate("toUserId", ["firstName", "userName", "avatarUrl"]);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: requests },
          "Requests Fetched Successfully",
        ),
      );
  },
);

export {
  editUserProfile,
  getUserProfile,
  deleteUserProfile,
  sendFollowRequest,
  viewIncomingRequests,
};
