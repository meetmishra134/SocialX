import { Router } from "express";
import { upload } from "../middlewares/multer";
import { createPost } from "../controllers/post.controller";
import { verifyJwt } from "../middlewares/auth.middleware";

const router = Router();

router
  .route("/upload-post")
  .post(verifyJwt, upload.array("images", 5), createPost);

export default router;
