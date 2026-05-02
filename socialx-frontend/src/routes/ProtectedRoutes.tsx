import { useAuth } from "@/store/authStore";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const isCheckingAuth = useAuth((state) => state.isCheckingAuth);

  if (!isAuthenticated && !isCheckingAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
