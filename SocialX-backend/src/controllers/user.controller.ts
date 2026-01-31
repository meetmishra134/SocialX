import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { User } from "../models/user.model";
import { ApiError } from "../utils/api.error";
import { ApiResponse } from "../utils/api.response";
import { updateMeInput } from "../validators/user.validator";
import { Post } from "../models/post.model";
import { FollowRequest } from "../models/followRequest.model";
import { hasMutualFollowing } from "../utils/mutal.relationship";

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
  const { userId: toUserId } = req.params;
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
      new ApiResponse(201, followRequest, "Follow request sent successfully"),
    );
});
//* Unfollow a user
const unfollowRequest = asyncHandler(async (req: Request, res: Response) => {
  const { _id: loggedInUserId } = req.user;
  const { userId: toUserId } = req.params;

  if (loggedInUserId.toString() === toUserId) {
    throw new ApiError(400, "You cannot unfollow yourself");
  }

  const isfollowing = await User.exists({
    _id: loggedInUserId,
    following: toUserId,
  });
  if (!isfollowing) {
    throw new ApiError(400, "You are not following this user ");
  }

  await User.findByIdAndUpdate(loggedInUserId, {
    $pull: { following: toUserId },
  });
  await User.findByIdAndUpdate(toUserId, {
    $pull: { followers: loggedInUserId },
  });

  return res.status(200).json(new ApiResponse(200, "Unfollowing successful"));
});

//* View incoming requests
const viewIncomingRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id: loggedInUserId } = req.user;
    const requests = await FollowRequest.find({
      toUserId: loggedInUserId,
      status: "pending",
    })
      .populate("fromUserId", "fullName userName avatarUrl")
      .select("-createdAt -updatedAt -toUserId")
      .lean()
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .json(
        new ApiResponse(200, { requests }, "Requests Fetched Successfully"),
      );
  },
);

//* Respond Incoming Requests
const respondIncomingRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id: loggedInUserId } = req.user;
    const { status, requestId } = req.params;
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status as string)) {
      throw new ApiError(400, "Status not allowed");
    }
    const followRequests = await FollowRequest.findOne({
      _id: requestId,
      toUserId: loggedInUserId,
      status: "pending",
    });
    if (!followRequests) {
      throw new ApiError(400, "Follow request doesn't exists");
    }
    await User.findByIdAndUpdate(loggedInUserId, {
      $addToSet: { followers: followRequests.fromUserId },
    });

    await User.findByIdAndUpdate(followRequests.fromUserId, {
      $addToSet: { following: loggedInUserId },
    });

    followRequests.status = status as "accepted" | "rejected";
    await followRequests.save();

    res
      .status(200)
      .json(new ApiResponse(200, `You have ${status} the follow request`));
  },
);

//* User Following
const userFollowing = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { _id: loggedInUserId } = req.user;
  let targetUserId: String;

  if (loggedInUserId.toString() === userId) {
    targetUserId = loggedInUserId.toString();
  } else {
    const isMutual = await hasMutualFollowing(
      loggedInUserId.toString(),
      userId as string,
    );
    if (!isMutual) {
      throw new ApiError(403, "You are not allowed to view ");
    }
    targetUserId = userId as string;
  }

  const user = await User.findById(targetUserId)
    .populate("following", "avatarUrl fullName userName")
    .select("following");

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user?.following ?? [],
        "Following fetched successfully",
      ),
    );
});

//* User Followers
const userFollowers = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { _id: loggedInUserId } = req.user;
  let targetUserId: string;
  if (loggedInUserId.toString() === userId) {
    targetUserId = loggedInUserId.toString();
  } else {
    const isMutual = await hasMutualFollowing(
      loggedInUserId.toString(),
      userId as string,
    );
    if (!isMutual) {
      throw new ApiError(403, "You are not allowed to view");
    }
    targetUserId = userId as string;
  }
  const user = await User.findById(targetUserId)
    .populate("followers", "avatarUrl fullName userName")
    .select("followers")
    .lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user?.followers ?? [],
        "Followers fetched successfully",
      ),
    );
});

const userDiscoveryList = asyncHandler(async (req: Request, res: Response) => {
  const { _id: loggedInUserId } = req.user;
  const users = await User.find({
    _id: { $ne: loggedInUserId },
  }).select("fullName avatarUrl userName");
  return res
    .status(200)
    .json(
      new ApiResponse(200, users, "User discovery list fetched successfully"),
    );
});

export {
  editUserProfile,
  getUserProfile,
  deleteUserProfile,
  sendFollowRequest,
  viewIncomingRequests,
  respondIncomingRequests,
  unfollowRequest,
  userFollowers,
  userFollowing,
  userDiscoveryList,
};
