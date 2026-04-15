import { api } from "@/lib/axios";

export const postServices = {
  createPost: async (postData: FormData) => {
    const response = await api.post("/posts/upload-post", postData);
    return response.data.data;
  },
  getPost: async () => {
    const response = await api.get("/feed/global");
    return response.data.data.posts;
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
  getUserPosts: async (userName: string) => {
    const res = await api.get(`/posts/${userName}`);
    return res.data.data.posts;
  },
};
