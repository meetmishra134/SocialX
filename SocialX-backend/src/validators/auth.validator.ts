import z from "zod";

const userRegistrationValidator = z.object({
  fullName: z.string().trim().min(2).max(20),
  userName: z.string().trim().min(2).max(20).toLowerCase(),
  email: z
    .email({ error: "Email is required and it must be valid" })
    .trim()
    .toLowerCase(),
  password: z.string({ error: "Password is required" }).min(3).max(15),
  bio: z.string().max(200).optional(),
  avatarUrl: z
    .object({
      url: z.url().optional(),
      localPath: z.string().optional(),
    })
    .optional(),
});
const userLoginValidator = z.object({
  email: z
    .email({ error: "Please provide a valid email address" })
    .trim()
    .lowercase({ error: "Email must be in lowercase" }),
  password: z.string({ error: "Password is required" }).trim(),
});
const userChangeCurrentPasswordValidator = z.object({
  oldPassword: z
    .string({ error: "Old password is required" })
    .min(3)
    .max(10)
    .trim(),
  newPassword: z
    .string({ error: "New Password is required" })
    .min(3)
    .max(10)
    .trim(),
});
const userForgotPasswordValidator = z.object({
  email: z
    .email({ error: "Please provide a valid email address" })
    .lowercase({ error: "Email must be in lowercase" })
    .trim(),
});
const userResetForgotPasswordValidator = z.object({
  newPassword: z
    .string({ error: "New password is required" })
    .min(3)
    .max(10)
    .trim(),
});
export {
  userRegistrationValidator,
  userLoginValidator,
  userForgotPasswordValidator,
  userChangeCurrentPasswordValidator,
  userResetForgotPasswordValidator,
};
