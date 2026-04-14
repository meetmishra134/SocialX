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
};
