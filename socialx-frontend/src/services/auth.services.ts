import { api } from "@/lib/axios";
import type { UserLoginData, UserRegistrationData } from "@/types/auth.types";
import axios from "axios";

export const authService = {
  login: async (data: UserLoginData) => {
    try {
      const res = await api.post("/auth/login", data);
      return res;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response?.data?.message || "Login failed";
        throw new Error(errorMessage);
      }
      throw new Error(
        "Network error. Please check your connection or try again later.",
      );
    }
  },

  register: async (data: UserRegistrationData) => {
    try {
      const res = await api.post("/auth/register", data);
      return res;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response?.data?.message || "Registration failed";
        throw new Error(errorMessage);
      }
      throw new Error(
        "Network error. Please check your connection or try again later.",
      );
    }
  },

  logout: async () => {
    try {
      const res = await api.post("/auth/logout", {});
      return res;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response?.data?.message || "Logout failed";
        throw new Error(errorMessage);
      }
      throw new Error(
        "Network error. Please check your connection or try again later.",
      );
    }
  },
  currentUser: async () => {
    try {
      const res = await api.get("/auth/current-user");
      return res;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response?.data?.message || "Failed to fetch current user";
        throw new Error(errorMessage);
      }
      throw new Error(
        "Network error. Please check your connection or try again later.",
      );
    }
  },
};
