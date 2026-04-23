import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { useAuth } from "./store/authStore";
import { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useSocketNotification } from "./hooks/useSocketNotification";

const App = () => {
  const checkAuth = useAuth((state) => state.checkAuth);
  useSocketNotification();
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </GoogleOAuthProvider>
  );
};

export default App;
