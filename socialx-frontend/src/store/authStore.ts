import { api } from "@/lib/axios";
import type { User } from "@/types/user.types";
import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
};
export const useAuth = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  login: (user, token) => {
    set({
      user,
      accessToken: token,
      isAuthenticated: true,
      isCheckingAuth: false,
    });
    console.log("User logged in:", user);
  },
  logout: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isCheckingAuth: false,
    });
  },
  checkAuth: async () => {
    try {
      const res = await api.get("/auth/current-user");
      set({
        user: res.data.data.user,
        accessToken: res.data.data.token,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
      console.error("Authentication check failed:", error);
    }
  },
}));
