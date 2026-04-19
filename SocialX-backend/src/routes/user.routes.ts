import { Router } from "express";
import {
  deleteUserProfile,
  editUserProfile,
  followUser,
  getBookmarkedPosts,
  getFollowers,
  getFollowing,
  getUserProfile,
  unfollowUser,
  userDiscoveryList,
} from "../controllers/user.controller";
import { verifyJwt } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer";

const router = Router();
router.route("/bookmarks").get(verifyJwt, getBookmarkedPosts);
router
  .route("/edit-me")
  .patch(verifyJwt, upload.single("avatar"), editUserProfile);
router.route("/discovery").get(verifyJwt, userDiscoveryList);
router.route("/:userId").get(verifyJwt, getUserProfile);
router.route("/follow/:userId").post(verifyJwt, followUser);
router.route("/unfollow/:userId").post(verifyJwt, unfollowUser);
router.route("/get-followers/:userId").get(verifyJwt, getFollowers);
router.route("/get-following/:userId").get(verifyJwt, getFollowing);

router.route("/delete-me").delete(verifyJwt, deleteUserProfile);

export default router;
