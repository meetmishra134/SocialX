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
};
