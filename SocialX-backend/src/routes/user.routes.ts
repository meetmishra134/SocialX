import { Router } from "express";
import {
  deleteUserProfile,
  editUserProfile,
  getUserProfile,
  respondIncomingRequests,
  sendFollowRequest,
  unfollowRequest,
  userDiscoveryList,
  userFollowers,
  userFollowing,
  viewIncomingRequests,
} from "../controllers/user.controller";
import { verifyJwt } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer";

const router = Router();
router
  .route("/edit-me")
  .patch(verifyJwt, upload.single("avatar"), editUserProfile);
router.route("/:userId").get(verifyJwt, getUserProfile);
router.route("/follow/:userId").post(verifyJwt, sendFollowRequest);
router.route("/me/follow-requests").get(verifyJwt, viewIncomingRequests);
router.route("/me").delete(verifyJwt, deleteUserProfile);
router
  .route("/review/:status/:requestId")
  .post(verifyJwt, respondIncomingRequests);

router.route("/unfollow/:userId").post(verifyJwt, unfollowRequest);
router.route("/:userId/following").post(verifyJwt, userFollowing);
router.route("/:userId/followers").get(verifyJwt, userFollowers);
router.route("/discovery").get(verifyJwt, userDiscoveryList);

export default router;
