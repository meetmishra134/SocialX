import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/store/authStore";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const isCheckingAuth = useAuth((state) => state.isCheckingAuth);
  if (!isAuthenticated && !isCheckingAuth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Outlet />
      {isCheckingAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-md">
          <Spinner className="size-10" />
        </div>
      )}
    </>
  );
};

export default ProtectedRoutes;
