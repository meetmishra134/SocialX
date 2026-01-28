import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { User } from "../models/user.model";
import { ApiError } from "../utils/api.error";
import { ApiResponse } from "../utils/api.response";
import { updateMeInput } from "../validators/user.validator";
import { Post } from "../models/post.model";

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

export { editUserProfile, getUserProfile, deleteUserProfile };
