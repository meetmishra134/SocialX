import { z } from "zod";

export const NotificationSchema = z.object({
  _id: z.string(),
  sender: z.object({
    _id: z.string(),
    fullName: z.string(),
    username: z.string(),
    avatarUrl: z.object({ url: z.string() }).optional(),
  }),
  recipient: z.string(),
  type: z.enum([
    "like",
    "comment",
    "follow",
    "likeComment",
    "community_post",
    "community_join",
  ]),
  post: z
    .object({
      _id: z.string(),
      text: z.string(),
      communityId: z.object({ _id: z.string(), name: z.string() }).optional(),
    })
    .optional(),
  comment: z.object({ _id: z.string(), text: z.string() }).optional(),
  isRead: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  communityId: z
    .union([z.string(), z.object({ _id: z.string(), name: z.string() })])
    .optional(),
  communityName: z.string().optional(),
});
export type Notification = z.infer<typeof NotificationSchema>;

export interface PaginatedNotifications {
  notifications: Notification[];
  hasMore: number;
  nextPage: number | null;
}
