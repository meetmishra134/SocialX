import { z } from "zod";

export const PostSchema = z.object({
  id: z.string(),
  author: z.object({
    id: z.string(),
    userName: z.string(),
    avatarUrl: z.url(),
  }),
  text: z.string().max(200).optional(),
  createdAt: z.string(),
  images: z.array(z.url()).optional(),
  likes: z.array(z.string()).optional(),
});

export type Post = z.infer<typeof PostSchema>;
