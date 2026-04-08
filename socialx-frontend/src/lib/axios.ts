import { useAuth } from "@/store/authStore";
import axios from "axios";
// const BASE_URL = "http://localhost:8000/api/v1";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;
    const authRoutes = [
      "/auth/login",
      "/auth/register",
      "/auth/logout",
      "/users/delete-me",
      "/auth/forgot-password",
      "/auth/reset-password",
    ];
    const isAuthRoute = authRoutes.some((route) =>
      originalRequest.url?.includes(route),
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute //
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(
          "http://localhost:8000/api/v1/auth/refresh-token",
          {},
          { withCredentials: true },
        );
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Session expired. Please log in again.");

        useAuth.getState().clearSession();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
