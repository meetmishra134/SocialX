import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { useAuth } from "./store/authStore";
import { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { useSocketNotification } from "./hooks/useSocketNotification";
import { socket } from "./lib/socket";

const App = () => {
  const { checkAuth, isAuthenticated, user } = useAuth();
  useSocketNotification();
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (isAuthenticated && user?._id) {
      if (!socket.connected) {
        socket.connect();
        socket.emit("join_own_room", user._id);
      }
    } else {
      socket.disconnect();
    }
  }, [isAuthenticated, user]);
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
      <Toaster />
    </GoogleOAuthProvider>
  );
};

export default App;
