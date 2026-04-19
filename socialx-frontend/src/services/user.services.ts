import { api } from "@/lib/axios";
import axios from "axios";

export const userService = {
  deleteUser: async () => {
    try {
      const res = await api.delete("/users/delete-me");
      return res;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response?.data?.message || "Failed to delete user profile";
        throw new Error(errorMessage);
      }
    }
  },
  getBookmarks: async () => {
    const res = await api.get("/users/bookmarks");
    return res.data.data.posts;
  },
  getUserProfile: async (userId: string) => {
    const res = await api.get(`/users/${userId}`);
    return res.data.data.userDetails;
  },

  discoverUsers: async () => {
    const res = await api.get("/users/discovery");
    return res.data.data.users;
  },

  followUser: async (userId: string) => {
    const res = await api.post(`/users/follow/${userId}`);
    return res.data;
  },
  unfollowUser: async (userId: string) => {
    const res = await api.post(`/users/unfollow/${userId}`);
    return res.data;
  },
  getFollowers: async (userId: string) => {
    const res = await api.get(`users/get-followers/${userId}`);
    return res.data.data.followers;
  },
  getFollowing: async (userId: string) => {
    const res = await api.get(`users/get-following/${userId}`);
    return res.data.data.following;
  },
  editUserProfile: async (data: FormData) => {
    const res = await api.patch("/users/edit-me", data);
    return res.data.data.user;
  },
};
