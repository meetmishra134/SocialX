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
  getUserProfile: async (userName: string) => {
    const res = await api.get(`/users/${userName}`);
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
  getFollowers: async (userName: string) => {
    const res = await api.get(`users/get-followers/${userName}`);
    return res.data.data.followers;
  },
  getFollowing: async (userName: string) => {
    const res = await api.get(`users/get-following/${userName}`);
    return res.data.data.following;
  },
};
