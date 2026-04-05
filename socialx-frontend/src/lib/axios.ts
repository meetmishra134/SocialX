import { useAuth } from "@/store/authStore";
import axios from "axios";
const BASE_URL = "http://localhost:8000/api/v1";
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // THE FIX: Add a check to ensure we aren't intercepting the logout route!
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/logout") // <-- ADD THIS LINE
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

        // We will fix this in Step 2!
        useAuth.getState().clearSession();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
