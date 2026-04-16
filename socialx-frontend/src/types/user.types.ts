import z from "zod";
export interface User {
  _id: string;
  fullName: string;
  userName: string;
  email: string;
  bookmarks: string[];
  bio?: string;
  followers: string[];
  following: string[];
  isEmailVerified: boolean;
  avatarUrl?: { url: string };
  createdAt: string;
  updatedAt: string;
}
export const userCardSchema = z.object({
  _id: z.string(),
  fullName: z.string(),
  userName: z.string(),
  bookmarks: z.array(z.string()).optional(),
  bio: z.string().max(100).optional(),
  avatarUrl: z.object({ url: z.string() }).optional(),
  isFollowing: z.boolean().optional(),
  followsMe: z.boolean().optional(),
  isOwnProfile: z.boolean().optional(),
});
export type UserCardType = z.infer<typeof userCardSchema>;
