import { Router } from "express";
import {
  currentUser,
  forgotPasswordRequest,
  googleLogin,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resendEmailVerification,
  resetForgotPassword,
  verifyEmail,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validator.middleware";
import {
  userRegistrationValidator,
  userLoginValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
} from "../validators/auth.validator";
import { verifyJwt } from "../middlewares/auth.middleware";

//! Unsecured Routes....
const router = Router();
router
  .route("/register")
  .post(validate(userRegistrationValidator), registerUser);
router.route("/login").post(validate(userLoginValidator), loginUser);

router.route("/verify-email/:verificationToken").get(verifyEmail);

router.route("/refresh-token").post(refreshAccessToken);
router.route("/google").post(googleLogin);
router
  .route("/forgot-password")
  .post(validate(userForgotPasswordValidator), forgotPasswordRequest);
router
  .route("/reset-password/:resetToken")
  .post(validate(userResetForgotPasswordValidator), resetForgotPassword);

//* Secured Routes....
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/current-user").get(verifyJwt, currentUser);
router
  .route("/resend-email-verification")
  .post(verifyJwt, resendEmailVerification);

export default router;
