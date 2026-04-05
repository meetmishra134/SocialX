import { authService } from "@/services/auth.services";
import type { User } from "@/types/user.types";
import { create } from "zustand";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearSession: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,

  login: (user) => {
    set({
      user,
      isAuthenticated: true,
      isCheckingAuth: false,
    });
    console.log("User logged in:", user);
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  },
  clearSession: () => {
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      const res = await authService.currentUser();
      set({
        user: res.data.data.user || res.data.data,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
      console.error("Authentication check failed:", error);
    }
  },
}));
