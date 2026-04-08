import { z } from "zod";

export const userRegistrationValidator = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be atleast two characters")
    .max(20),
  userName: z.string().trim().min(2).max(20).toLowerCase(),
  email: z.email("Email is required and it must be valid").trim().toLowerCase(),
  password: z.string("Password is required").min(6).max(10),
  bio: z.string().max(200).optional(),
  avatarUrl: z
    .object({
      url: z.url().optional(),
      localPath: z.string().optional(),
    })
    .optional(),
});
export const userLoginValidator = z.object({
  email: z
    .email({ error: "Please provide a valid email address" })
    .trim()
    .lowercase({ error: "Email must be in lowercase" }),
  password: z
    .string("Password is required")
    .trim()
    .min(6, "password must be atleast 6 characters")
    .max(10, "Password must be atmost 10 characters"),
});

export const userResetForgotPasswordValidator = z
  .object({
    newPassword: z
      .string("New password is required")
      .trim()
      .min(6, "New password must be atleast 6 characters")
      .max(10, "New password must be atmost 10 characters"),
    confirmPassword: z
      .string("Confirm password is required")
      .trim()
      .min(6, "Confirm password must be atleast 6 characters")
      .max(10, "Confirm password must be atmost 10 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export const userForgotPasswordValidator = z.object({
  email: z
    .email({ error: "Please provide a valid email address" })
    .lowercase({ error: "Email must be in lowercase" })
    .trim(),
});
export type UserRegistrationData = z.infer<typeof userRegistrationValidator>;
export type UserLoginData = z.infer<typeof userLoginValidator>;
export type UserResetForgotPasswordData = z.infer<
  typeof userResetForgotPasswordValidator
>;
export type UserForgotPasswordData = z.infer<
  typeof userForgotPasswordValidator
>;
