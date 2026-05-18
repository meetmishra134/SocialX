import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useAuth } from "@/store/authStore";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const isCheckingAuth = useAuth((state) => state.isCheckingAuth);
  if (isCheckingAuth) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
