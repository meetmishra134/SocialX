import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { User } from "../models/user.model";
import { ApiError } from "../utils/api.error";
import { ApiResponse } from "../utils/api.response";
import { updateMeInput, updateMeSchema } from "../validators/user.validator";
import { Post } from "../models/post.model";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import fs from "fs/promises";
import { Notification } from "../models/notification.model";

//* Get any user detail
const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { _id: loggedInUserId } = req.user;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(403, "User does not exist");
  }
  const isFollowing = user.followers.includes(loggedInUserId);
  const isOwnProfile = loggedInUserId.toString() === user._id.toString();
  const userDetails = {
    _id: user._id,
    userName: user.userName,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl?.url || "",
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
        { userDetails },
        "User details fetched successfully",
      ),
    );
});

//* Update or edit profile information
const editUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { _id: loggedInUserId } = req.user;
  const file = req.file;
  const { userName, bio } = req.body as updateMeInput;

  const updateData: any = {};
  if (userName) {
    updateData.userName = userName;
  }
  if (bio) {
    updateData.bio = bio;
  }
  if (Object.keys(updateData).length === 0 && !file) {
    throw new ApiError(400, "Nothing to update");
  }
  let validateData = updateMeSchema.partial().parse(updateData);
  if (file) {
    try {
      const uploadResult = await uploadToCloudinary(file.path, {
        folder: "socialx/profile_pictures",
        publicId: `user-${loggedInUserId}`,
      });
      validateData.avatarUrl = {
        url: uploadResult.secure_url,
      };
      await fs.unlink(file.path).catch(() => {});
    } catch (err) {
      await fs.unlink(file.path).catch(() => {});
      throw new ApiError(500, "Error uploading avatar");
    }
  }

  await User.findByIdAndUpdate(loggedInUserId, validateData, {
    new: true,
  });
  const user = await User.findById(loggedInUserId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const userDetails = {
    _id: user._id,
    userName: user.userName,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl?.url || "",
    bio: user.bio,
    followersCount: user.followers.length,
    followingCount: user.following.length,
    isOwnProfile: true,
    isFollowing: false,
    isEmailVerified: user.isEmailVerified,
  };
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: userDetails },
        "Details updated successfully",
      ),
    );
});

//* Delete a user profile
const deleteUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { _id: loggedInUserId } = req.user;
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
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .json(new ApiResponse(200, "User deleted successfully"));
});

const userDiscoveryList = asyncHandler(async (req: Request, res: Response) => {
  const { _id: loggedInUserId } = req.user;
  const me = await User.findById(loggedInUserId).select("following").lean();
  if (!me) {
    throw new ApiError(404, "User not found");
  }
  const excludedUserIds = [loggedInUserId, ...me.following];
  const users = await User.find({ _id: { $nin: excludedUserIds } })
    .select("userName fullName avatarUrl bio ")
    .limit(10)
    .lean();

  const formattedUsers = users.map((user) => ({
    ...user,
    isFollowing: false,
  }));
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { users: formattedUsers },
        "User discovery list fetched successfully",
      ),
    );
});

const followUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { _id: loggedInUserId } = req.user;

  if (loggedInUserId.toString() === userId) {
    throw new ApiError(400, "You cannot follow yourself");
  }
  const userToFollow = await User.findById(userId);
  if (!userToFollow) {
    throw new ApiError(404, "User not found");
  }
  const alreadyFollowing = await User.exists({
    _id: loggedInUserId,
    following: userId,
  });
  if (alreadyFollowing) {
    throw new ApiError(400, "You are already following this user");
  }
  await User.findByIdAndUpdate(loggedInUserId, {
    $addToSet: { following: userId },
  });
  await User.findByIdAndUpdate(userId, {
    $addToSet: { followers: loggedInUserId },
  });
  if (userToFollow.isEmailVerified) {
    const notification = await Notification.create({
      recipient: userId,
      sender: loggedInUserId,
      type: "follow",
    });
    await notification.populate("sender", "userName avatarUrl");
    globalThis.io.to(userId).emit("new_notification", notification);
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "You are now following this user"));
});

const unfollowUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { _id: loggedInUserId } = req.user;
  if (loggedInUserId.toString() === userId) {
    throw new ApiError(400, "You cannot unfollow yourself");
  }
  const isFollowing = await User.exists({
    _id: loggedInUserId,
    following: userId,
  });
  if (!isFollowing) {
    throw new ApiError(400, "You are not following this user");
  }
  await User.findByIdAndUpdate(loggedInUserId, {
    $pull: { following: userId },
  });
  await User.findByIdAndUpdate(userId, {
    $pull: { followers: loggedInUserId },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "You have unfollowed this user"));
});

const getFollowers = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { _id: loggedInUserId } = req.user;
  const user = await User.findById(userId)
    .populate("followers", "userName fullName avatarUrl")
    .select("followers");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const me = await User.findById(loggedInUserId)
    .select("followers following")
    .lean();
  const formattedFollowers = user.followers.map((follower: any) => {
    const isFollowing = me?.following.some(
      (id) => id.toString() === follower._id.toString(),
    );
    const followsMe = me.followers.some(
      (id) => id.toString() === follower._id.toString(),
    );
    const isOwnProfile = loggedInUserId.toString() === follower._id.toString();
    return {
      ...follower.toObject(),
      isFollowing,
      followsMe,
      isOwnProfile,
    };
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { followers: formattedFollowers },
        "Followers fetched successfully",
      ),
    );
});

const getFollowing = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { _id: loggedInUserId } = req.user;
  const user = await User.findById(userId)
    .select("following")
    .populate("following", "userName fullName avatarUrl");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const me = await User.findById(loggedInUserId)
    .select("followers following")
    .lean();
  const formattedFollowing = user.following.map((following: any) => {
    const isFollowing = me?.following.some(
      (id) => id.toString() === following._id.toString(),
    );
    const followsMe = me.followers.some(
      (id) => id.toString() === following._id.toString(),
    );
    const isOwnProfile = loggedInUserId.toString() === following._id.toString();
    return {
      ...following.toObject(),
      isFollowing,
      followsMe,
      isOwnProfile,
    };
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { following: formattedFollowing },
        "Following fetched successfully",
      ),
    );
});

//* Get bookmarked posts
const getBookmarkedPosts = asyncHandler(async (req: Request, res: Response) => {
  const { _id: loggedInUserId } = req.user;
  const user = await User.findById(loggedInUserId).select("bookmarks").lean();
  const posts = await Post.find({ _id: { $in: user?.bookmarks ?? [] } })
    .populate("author", "userName fullName avatarUrl")
    .lean();
  return res
    .status(200)
    .json(
      new ApiResponse(200, { posts }, "Bookmarked posts fetched successfully"),
    );
});
const getUserNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id: loggedInUserId } = req.user;
    const notifications = await Notification.find({
      recipient: loggedInUserId,
    })
      .populate("sender", "userName avatarUrl fullName")
      .populate("post", "text")
      .sort({ createdAt: -1 })
      .limit(20);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { notifications },
          "Notifications fetched successfully",
        ),
      );
  },
);
const markNotificationRead = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id: loggedInUserId } = req.user;
    await Notification.updateMany(
      { recipient: loggedInUserId, isRead: false },
      { $set: { isRead: true } },
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Notifications marked as read successfully"),
      );
  },
);

export {
  editUserProfile,
  getUserProfile,
  deleteUserProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getBookmarkedPosts,
  userDiscoveryList,
  getUserNotifications,
  markNotificationRead,
};
