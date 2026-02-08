import z from "zod";

export const updateMeSchema = z.object({
  userName: z.string().min(2).max(20).optional(),
  avatarUrl: z.object({
    url: z.url().optional(),
  }),
  bio: z.string().max(200).optional(),
});

export type updateMeInput = z.infer<typeof updateMeSchema>;
