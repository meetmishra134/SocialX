import { Router } from "express";
import { getUserProfile } from "../controllers/user.controller";
import { verifyJwt } from "../middlewares/auth.middleware";

const router = Router();
router.route("/:userId").get(verifyJwt, getUserProfile);
export default router;
