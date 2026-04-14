import { z } from "zod";

export const CommentSchema = z.object({
  _id: z.string(),
  author: z.object({
    _id: z.string(),
    userName: z.string(),
    fullName: z.string(),
    avatarUrl: z.object({
      url: z.string(),
      publicId: z.string().optional(),
    }),
  }),
  text: z.string().max(200),
  likes: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CommentType = z.infer<typeof CommentSchema>;
