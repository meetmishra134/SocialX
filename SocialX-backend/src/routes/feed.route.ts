import { Router } from "express";
import { globalFeed, followingFeed } from "../controllers/feed.controller";
import { verifyJwt } from "../middlewares/auth.middleware";

const router = Router();

router.route("/global").get(verifyJwt, globalFeed);
router.route("/following").get(verifyJwt, followingFeed);

export default router;
