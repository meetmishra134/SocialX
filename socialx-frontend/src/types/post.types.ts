import { z } from "zod";

export const PostSchema = z.object({
  _id: z.string(),
  author: z.object({
    _id: z.string(),
    fullName: z.string(),
    userName: z.string(),
    avatarUrl: z.url(),
  }),
  text: z.string().max(400).optional(),
  createdAt: z.string(),
  topics: z.array(z.string()).optional(),
  images: z
    .array(
      z.object({
        url: z.url(),
        publicId: z.string().optional(),
      }),
    )
    .optional(),
  likes: z.array(z.string()).optional(),
});

export type Post = z.infer<typeof PostSchema>;
