import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/store/authStore";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const isCheckingAuth = useAuth((state) => state.isCheckingAuth);
  if (isCheckingAuth) {
    return (
      <div className=" h-screen inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center fixed z-50">
        <Spinner className="size-10" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoutes;
