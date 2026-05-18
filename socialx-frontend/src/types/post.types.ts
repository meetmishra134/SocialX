import { z } from "zod";
export interface Comments {
  _id: string;
  author: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  likes: string[];
  post: string;
}
export interface PaginatedComments {
  comments: Comments[];
  hasMore: boolean;
  nextPage: number | null;
}
export interface PaginatedPosts {
  posts: Post[];
  hasMore: boolean;
  nextPage: number | null;
}
export const PostSchema = z.object({
  _id: z.string(),
  author: z.object({
    _id: z.string(),
    fullName: z.string(),
    userName: z.string(),
    avatarUrl: z.object({
      url: z.url(),
    }),
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
  communityId: z.string().optional(),
});

export type Post = z.infer<typeof PostSchema>;
