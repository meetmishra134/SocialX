import { Router } from "express";
import { upload } from "../middlewares/multer";
import {
  commentOnPost,
  createPost,
  deleteComment,
  deletePost,
  likeDislikePost,
  searchPostByTopic,
  toggleBookmark,
  getUserPosts,
  viewComments,
  viewPost,
  likeDislikeComment,
  getPostsByTopic,
  editComment,
} from "../controllers/post.controller";
import { verifyJwt } from "../middlewares/auth.middleware";

const router = Router();

router
  .route("/upload-post")
  .post(verifyJwt, upload.array("files", 4), createPost);
router.route("/search").get(verifyJwt, searchPostByTopic);
router.route("/posts-by-topic").get(verifyJwt, getPostsByTopic);
router.route("/view-post/:postId").get(verifyJwt, viewPost);
router.route("/:userId").get(verifyJwt, getUserPosts);
router.route("/bookmark/:postId").post(verifyJwt, toggleBookmark);
router.route("/delete-post/:postId").delete(verifyJwt, deletePost);
router.route("/comment/:postId").post(verifyJwt, commentOnPost);
router.route("/like/:postId").post(verifyJwt, likeDislikePost);
router.route("/like-comment/:commentId").post(verifyJwt, likeDislikeComment);
router.route("/comments/:postId").get(verifyJwt, viewComments);
router.route("/edit-comment/:commentId").patch(verifyJwt, editComment);

router.route("/delete-comment/:commentId").delete(verifyJwt, deleteComment);

export default router;
