import { api } from "@/lib/axios";

export const postServices = {
  createPost: async (postData: FormData) => {
    const response = await api.post("/posts/upload-post", postData);
    return response.data.data;
  },
  getPost: async ({
    pageParam = 1,
    limit = 10,
  }: {
    pageParam: number;
    limit: number;
  }) => {
    const response = await api.get(
      `/feed/global/?page=${pageParam}&limit=${limit}`,
    );
    return response.data.data;
  },
  getFollowingPosts: async ({
    pageParam = 1,
    limit = 10,
  }: {
    pageParam: number;
    limit: number;
  }) => {
    const res = await api.get(
      `/feed/following/?page=${pageParam}&limit=${limit}`,
    );
    return res.data.data.posts;
  },
  deletePost: async (postId: string) => {
    const res = await api.delete(`/posts/delete-post/${postId}`);
    return res.data;
  },
  getSinglePost: async (postId: string) => {
    const res = await api.get(`/posts/view-post/${postId}`);
    return res.data.data.post;
  },
  fetchPostsByTopic: async (topic: string) => {
    const res = await api.get(`/posts/search`, {
      params: { topic },
    });
    return res.data.data.posts;
  },
  toggleLike: async (postId: string) => {
    const res = await api.post(`/posts/like/${postId}`);
    return res.data;
  },
  toggleBookmark: async (postId: string) => {
    const res = await api.post(`/posts/bookmark/${postId}`);
    return res.data;
  },
  getUserPosts: async (userId: string) => {
    const res = await api.get(`/posts/${userId}`);
    return res.data.data.posts;
  },
  toggleCommentLike: async (commentId: string) => {
    const res = await api.post(`/posts/like-comment/${commentId}`);
    return res.data;
  },
};
