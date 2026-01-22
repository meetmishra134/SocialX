import z from "zod";

const userRegistrationValidator = z.object({
  fullName: z.string().trim().min(2).max(20),
  userName: z.string().trim().min(2).max(20).toLowerCase(),
  email: z.email("Email is required").trim().toLowerCase(),
  password: z.string("Password is required").min(3).max(10),
});
const userLoginValidator = z.object({
  email: z
    .email("Please provide a valid email address")
    .trim()
    .lowercase("Email must be in lowercase"),
  password: z.string("Password is required").trim(),
});
const userChangeCurrentPasswordValidator = z.object({
  oldPassword: z.string("Old password is required").min(3).max(10).trim(),
  newPassword: z.string("New password is required").min(3).max(10).trim(),
});
const userForgotPasswordValidator = z.object({
  email: z
    .email("Email is required")
    .lowercase("Email must be in lowercase")
    .trim(),
});
const userResetForgotPasswordValidator = z.object({
  newPassword: z.string("Password is required").min(3).max(10).trim(),
});
export {
  userRegistrationValidator,
  userLoginValidator,
  userForgotPasswordValidator,
  userChangeCurrentPasswordValidator,
  userResetForgotPasswordValidator,
};
