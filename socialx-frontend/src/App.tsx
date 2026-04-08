import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { useAuth } from "./store/authStore";
import { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App = () => {
  const checkAuth = useAuth((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
      <Toaster />
    </GoogleOAuthProvider>
  );
};

export default App;
