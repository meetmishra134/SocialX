import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import {
  createCommunity,
  createCommunityPost,
  deleteCommunity,
  deleteCommunityMember,
  deleteCommunityPost,
  discoverCommunity,
  getAllMembers,
  getCommunitiesPosts,
  getCommunity,
  getCommunityNotifications,
  getUserJoinedCommunities,
  joinCommunity,
  leaveCommunity,
  markAllCommunityNotificationAsRead,
} from "../controllers/community.controller";
import { upload } from "../middlewares/multer";

const router = Router();
router.route("/").post(verifyJwt, upload.single("avatar"), createCommunity);
router.route("/").get(verifyJwt, discoverCommunity);
router.route("/joined").get(verifyJwt, getUserJoinedCommunities);
router.route("/:communityId/members").get(verifyJwt, getAllMembers);
router
  .route("/:communityId/members/:userId")
  .delete(verifyJwt, deleteCommunityMember);
router.route("/:communityId").delete(verifyJwt, deleteCommunity);
router.route("/:communityId").get(verifyJwt, getCommunity);
router.route("/:communityId/join").post(verifyJwt, joinCommunity);
router.route("/:communityId/leave").post(verifyJwt, leaveCommunity);
router
  .route("/:communityId/mark-notifications-read")
  .post(verifyJwt, markAllCommunityNotificationAsRead);
router.route("/:communityId/posts").get(verifyJwt, getCommunitiesPosts);
router
  .route("/:communityId/notifications")
  .get(verifyJwt, getCommunityNotifications);
router
  .route("/:communityId/posts/:postId")
  .delete(verifyJwt, deleteCommunityPost);

router
  .route("/:communityId/posts")
  .post(verifyJwt, upload.array("files", 4), createCommunityPost);

export default router;
