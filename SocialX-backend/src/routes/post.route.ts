import { Router } from "express";
import { upload } from "../middlewares/multer";
import {
  commentOnPost,
  createPost,
  deleteComment,
  deletePost,
  likeDislikePost,
  viewComments,
} from "../controllers/post.controller";
import { verifyJwt } from "../middlewares/auth.middleware";

const router = Router();

router
  .route("/upload-post")
  .post(verifyJwt, upload.array("images", 5), createPost);

router.route("/delete-post/:postId").delete(verifyJwt, deletePost);
router.route("/comment/:postId").post(verifyJwt, commentOnPost);
router.route("/like/:postId").post(verifyJwt, likeDislikePost);
router.route("/comments/:postId").get(verifyJwt, viewComments);
router.route("/delete-comment/:commentId").delete(verifyJwt, deleteComment);

export default router;
