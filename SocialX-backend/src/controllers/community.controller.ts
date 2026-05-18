import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { Community } from "../models/community.model";
import { ApiError } from "../utils/api.error";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { ApiResponse } from "../utils/api.response";
import fs from "fs/promises";
import cloudinary from "../server";
import { Post } from "../models/post.model";
import { UploadApiResponse } from "cloudinary";
import { Notification } from "../models/notification.model";

const createCommunity = asyncHandler(async (req: Request, res: Response) => {
  const { _id: loggedInUserId } = req.user;
  const { name, description } = req.body;
  const file = req.file;
  const existingCommunity = await Community.findOne({ name });
  if (existingCommunity) {
    throw new ApiError(400, "Community already exists");
  }
  let avatar = null;
  if (file) {
    try {
      const uploadResult = await uploadToCloudinary(file.path, {
        folder: "socialx/communities",
        publicId: `${name}-${Date.now()}`,
      });
      avatar = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
      await fs.unlink(file.path).catch(() => {});
    } catch (error) {
      await fs.unlink(file.path).catch(() => {});
      throw new ApiError(500, "Failed to upload avatar");
    }
  }
  const community = await Community.create({
    name,
    description,
    avatar,
    creator: loggedInUserId,
    members: [loggedInUserId],
    membersCount: 1,
  });
  res
    .status(201)
    .json(
      new ApiResponse(201, { community }, "Community created successfully"),
    );
});

const deleteCommunity = asyncHandler(async (req: Request, res: Response) => {
  const { communityId } = req.params;
  const { _id: loggedInuserId } = req.user;
  const community = await Community.findById(communityId);
  if (!community) {
    throw new ApiError(404, "Community not found");
  }
  if (community.creator.toString() !== loggedInuserId.toString()) {
    throw new ApiError(
      403,
      "Only the community creator can delete the community",
    );
  }
  if (community.avatar?.publicId) {
    await cloudinary.uploader
      .destroy(community.avatar.publicId)
      .catch(() => {}); // Delete avatar from Cloudinary if it exists
  }
  await Post.deleteMany({ community: communityId });
  await Notification.deleteMany({ communityId });
  await community.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Community deleted successfully"));
});

const discoverCommunity = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const page = parseInt(req.query.page as string) || 1;
  const skip = (page - 1) * limit;
  const { _id: loggedInUserId } = req.user;

  const communities = await Community.find({
    members: { $ne: loggedInUserId },
  })
    .populate("creator", "fullName userName avatarUrl")
    .sort({ membersCount: -1 })
    .limit(limit)
    .skip(skip);
  const totalCommunities = await Community.countDocuments({
    members: { $ne: loggedInUserId },
  });
  const hasMore = skip + communities.length < totalCommunities;
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { communities, hasMore, nextPage: hasMore ? page + 1 : null },
        "Communities retrieved successfully",
      ),
    );
});
const getCommunity = asyncHandler(async (req: Request, res: Response) => {
  const { communityId } = req.params;
  const community = await Community.findById(communityId);
  if (!community) {
    throw new ApiError(404, "Community not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, { community }, "Community retrieved successfully"),
    );
});
const joinCommunity = asyncHandler(async (req: Request, res: Response) => {
  const { communityId } = req.params as { communityId: string };
  const { _id: loggedInUserId } = req.user;
  const community = await Community.findById(communityId);
  if (!community) {
    throw new ApiError(404, "Community not found");
  }
  if (community.members.some((id) => id.equals(loggedInUserId))) {
    throw new ApiError(400, "Already a member of this community");
  }
  await Community.findByIdAndUpdate(communityId, {
    $push: { members: loggedInUserId },
    $inc: { membersCount: 1 },
  });
  if (community.creator.toString() !== loggedInUserId.toString()) {
    const notification = await Notification.create({
      recipient: community.creator,
      type: "community_join",
      sender: loggedInUserId,
      communityId,
    });
    await notification.populate("communityId", "name");

    globalThis.io.to(community.creator.toString()).emit("new_notification", {
      type: "community_join",
      communityId,
      communityName: community.name,
      sender: {
        _id: loggedInUserId,
        fullName: req.user.fullName,
        userName: req.user.userName,
        avatarUrl: req.user.avatarUrl,
      },
    });
  }
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Successfully joined the community"));
});
const leaveCommunity = asyncHandler(async (req: Request, res: Response) => {
  const { communityId } = req.params;
  const { _id: loggedInUserId } = req.user;
  const community = await Community.findById(communityId);
  if (!community) {
    throw new ApiError(404, "Community not found");
  }
  if (community.creator.equals(loggedInUserId)) {
    throw new ApiError(400, "Community creator cannot leave the community");
  }
  if (!community.members.some((id) => id.equals(loggedInUserId))) {
    throw new ApiError(400, "Not a member of this community");
  }
  await Community.findByIdAndUpdate(communityId, {
    $pull: { members: loggedInUserId },
    $inc: { membersCount: -1 },
  });
  await Notification.deleteMany({
    recipient: community.creator,
    type: "community_join",
  });
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Successfully left the community"));
});
const getCommunitiesPosts = asyncHandler(
  async (req: Request, res: Response) => {
    const { communityId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;
    const community = await Community.findById(communityId);
    if (!community) {
      throw new ApiError(404, "Community not found");
    }
    const posts = await Post.find({ communityId })
      .populate("author", "userName fullName avatarUrl")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    const totalPosts = await Post.countDocuments({ communityId });
    const hasMore = skip + posts.length < totalPosts;
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { posts, hasMore, nextPage: hasMore ? page + 1 : null },
          "Posts retrieved successfully",
        ),
      );
  },
);
const createCommunityPost = asyncHandler(
  async (req: Request, res: Response) => {
    const { communityId } = req.params as { communityId: string };
    const { _id: loggedInUserId, userName } = req.user;
    const { text, topics } = req.body;
    const files = req.files as Express.Multer.File[] | undefined;
    const sanitizedTopics = Array.isArray(topics) ? topics.slice(0, 5) : [];
    const community = await Community.findById(communityId);
    if (!community) {
      throw new ApiError(404, "Community not found");
    }
    if (!community.members.some((id) => id.equals(loggedInUserId))) {
      throw new ApiError(403, "Must be a member of the community to post");
    }
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
      text,
      images: postImages,
      topics: sanitizedTopics,
      author: loggedInUserId,
      communityId,
    });
    await Community.findByIdAndUpdate(communityId, { $inc: { postsCount: 1 } });
    const membersToNotify = community.members.filter(
      (_id) => _id.toString() !== loggedInUserId.toString(),
    );
    await Notification.insertMany(
      membersToNotify.map((memberId) => ({
        recipient: memberId,
        sender: loggedInUserId,
        type: "community_post",
        post: post._id,
        communityId,
      })),
    );
    globalThis.io
      .to(`community:${communityId}`)
      .emit("community-notification", {
        type: "community_post",
        postId: post._id,
        communityId,
        sender: {
          _id: loggedInUserId,
          userName: req.user.userName,
          fullName: req.user.fullName,
          avatarUrl: req.user.avatarUrl,
        },
        communityName: community.name,
        createdAt: new Date(),
      });
    membersToNotify.forEach((memberId) => {
      globalThis.io.to(`user:${memberId}`).emit("new_notification", {
        type: "community_post",
        communityId,
        postId: post._id,
        sender: {
          _id: loggedInUserId,
          userName: req.user.userName,
          fullName: req.user.fullName,
          avatarUrl: req.user.avatarUrl,
        },
        communityName: community.name,
      });
    });
    return res
      .status(201)
      .json(new ApiResponse(201, { post }, "Post created successfully"));
  },
);
const getUserJoinedCommunities = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const { _id: loggedInUserId } = req.user;
    const communities = await Community.find({
      members: loggedInUserId,
    })
      .populate("creator", "name avatar description")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-members");
    const totalCommunities = await Community.countDocuments({
      members: loggedInUserId,
    });
    const hasMore = skip + communities.length < totalCommunities;
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { communities, hasMore, nextPage: hasMore ? page + 1 : null },
          "User's joined communities retrieved successfully",
        ),
      );
  },
);
const deleteCommunityPost = asyncHandler(
  async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { _id: loggedInUserId } = req.user;
    const post = await Post.findById(postId).populate(
      "communityId",
      "creator ",
    );
    if (!post) {
      throw new ApiError(404, "Post not found");
    }
    const isCommunityCreator =
      (post.communityId as any)?.creator?.toString() ===
      loggedInUserId.toString();
    const isPostAuthor = post.author.toString() === loggedInUserId.toString();
    if (!isCommunityCreator && !isPostAuthor) {
      throw new ApiError(403, "Only the post author can delete the post");
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
    if (post.communityId) {
      await Community.findByIdAndUpdate(post.communityId, {
        $inc: { postsCount: -1 },
      });
    }
    const notifications = await Notification.find({ post: postId });
    const notificationIds = notifications.map((n) => n._id);
    await Notification.deleteMany({ _id: { $in: notificationIds } });
    await post.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Post deleted successfully"));
  },
);
const getAllMembers = asyncHandler(async (req: Request, res: Response) => {
  const { communityId } = req.params;
  const limit = parseInt(req.query.limit as string) || 10;
  const page = parseInt(req.query.page as string) || 1;
  const skip = (page - 1) * limit;
  const community = await Community.findById(communityId)
    .populate("members", "fullName userName avatarUrl")
    .select("members")
    .skip(skip)
    .limit(limit);
  if (!community) {
    throw new ApiError(404, "Community not found");
  }
  const hasMore = skip + community.members.length < community.membersCount;
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        members: community.members,
        creator: community.creator,
        hasMore,
        nextPage: hasMore ? page + 1 : null,
        total: community.membersCount,
      },
      "Members Fetched Successfully",
    ),
  );
});
const deleteCommunityMember = asyncHandler(
  async (req: Request, res: Response) => {
    const { communityId, userId } = req.params as {
      communityId: string;
      userId: string;
    };
    const { _id: loggedInUserId } = req.user;
    const community = await Community.findById(communityId);
    if (!community) {
      throw new ApiError(404, "Community not found");
    }
    if (!community.creator.equals(loggedInUserId)) {
      throw new ApiError(403, "Only the community creator can remove members");
    }
    if (!community.members.some((id) => id.equals(userId))) {
      throw new ApiError(400, "User is not a member of this community");
    }
    if (community.creator.equals(userId)) {
      throw new ApiError(400, "Community creator cannot be removed");
    }
    await Community.findByIdAndUpdate(communityId, {
      $pull: { members: userId },
      $inc: { membersCount: -1 },
    });
    await Notification.deleteMany({
      recipient: community.creator,
      type: "community_join",
    });
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Member removed successfully"));
  },
);
const getCommunityNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const { communityId } = req.params;
    const { _id: loggedInUserId } = req.user;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const community = await Community.findById(communityId);
    if (!community) {
      throw new ApiError(404, "Community not found");
    }
    if (!community.members.some((id) => id.equals(loggedInUserId))) {
      throw new ApiError(
        403,
        "Must be a member of the community to view notifications",
      );
    }
    const notifications = await Notification.find({
      type: { $in: ["community_post"] },
      recipient: loggedInUserId,
      communityId,
    })
      .populate("sender", "userName avatarUrl fullName")
      .populate("post", "text")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    const totalNotifications = await Notification.countDocuments({
      type: { $in: ["community_post"] },
      recipient: loggedInUserId,
      communityId,
    });
    const hasMore = skip + notifications.length < totalNotifications;
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { notifications, hasMore, nextPage: hasMore ? page + 1 : null },
          "Community notifications fetched successfully",
        ),
      );
  },
);
const markAllCommunityNotificationAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const { communityId } = req.params;
    const { _id: loggedInUserId } = req.user;
    const community = await Community.findById(communityId);
    if (!community) {
      throw new ApiError(404, "Community not found");
    }
    if (!community.members.some((id) => id.equals(loggedInUserId))) {
      throw new ApiError(
        403,
        "Must be a member of the community to mark notifications as read",
      );
    }
    await Notification.updateMany(
      {
        communityId,
        recipient: loggedInUserId,
        isRead: false,
      },
      { $set: { isRead: true } },
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "All community notifications marked as read",
        ),
      );
  },
);
export {
  createCommunity,
  deleteCommunity,
  discoverCommunity,
  getCommunity,
  joinCommunity,
  leaveCommunity,
  getCommunitiesPosts,
  createCommunityPost,
  getUserJoinedCommunities,
  deleteCommunityPost,
  getAllMembers,
  deleteCommunityMember,
  getCommunityNotifications,
  markAllCommunityNotificationAsRead,
};
