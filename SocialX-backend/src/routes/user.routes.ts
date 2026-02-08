import { Router } from "express";
import {
  editUserProfile,
  getUserProfile,
  sendFollowRequest,
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
router.route("/me/follow-requests").post(verifyJwt, viewIncomingRequests);

export default router;
