import { api } from "@/lib/axios";

export const commentServices = {
  getComments: async ({
    postId,
    pageParam = 1,
    limit = 3,
  }: {
    postId: string;
    pageParam: number;
    limit: number;
  }) => {
    const res = await api.get(
      `/posts/comments/${postId}?page=${pageParam}&limit=${limit}`,
    );
    return res.data.data;
  },
  createComment: async ({
    postId,
    comment,
  }: {
    postId: string;
    comment: string;
  }) => {
    const res = await api.post(`/posts/comment/${postId}`, { comment });
    return res.data.data.comments;
  },
  deleteComment: async (commentId: string) => {
    const res = await api.delete(`/posts/delete-comment/${commentId}`);
    return res.data;
  },
};
