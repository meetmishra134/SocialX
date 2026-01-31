import { Router } from "express";
import {
  getUserProfile,
  sendFollowRequest,
  viewIncomingRequests,
} from "../controllers/user.controller";
import { verifyJwt } from "../middlewares/auth.middleware";

const router = Router();
router.route("/:userId").get(verifyJwt, getUserProfile);
router.route("/follow/:userId").post(verifyJwt, sendFollowRequest);
router.route("/me/follow-requests").post(verifyJwt, viewIncomingRequests);

export default router;
