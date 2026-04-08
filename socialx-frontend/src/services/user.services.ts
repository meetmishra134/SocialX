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
};
