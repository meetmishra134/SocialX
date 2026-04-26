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
  type: z.enum(["like", "comment", "follow", "likeComment"]),
  post: z.object({ _id: z.string(), text: z.string() }).optional(),
  isRead: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Notification = z.infer<typeof NotificationSchema>;
