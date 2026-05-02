import { Ellipsis, LogOut, UserRoundXIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.services";
import { toast } from "sonner";
import { userService } from "@/services/user.services";
import DeleteAccountModal from "../ui/DeleteAccountModal";
import { useState } from "react";

const ProfileSettings = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const logout = useAuth((state) => state.logout);
  const clearSession = useAuth((state) => state.clearSession);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await authService.logout();
      toast.success(res.data?.message || "Logged out successfully", {
        position: "top-center",
      });
      navigate("/login");
      logout();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message, { position: "top-center" });
      } else {
        toast.error("An unexpected error occurred. Please try again.", {
          position: "top-center",
        });
      }
    }
  };
  const handleDeleteProfile = async () => {
    try {
      const res = await userService.deleteUser();
      toast.success(res?.data.data || "User profile deleted successfully", {
        position: "top-center",
      });
      navigate("/login");
      clearSession();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { position: "top-center" });
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-800/10">
            <Ellipsis size={20} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="bg-background w-44 rounded-md border p-1 shadow-md"
        >
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleLogout();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setShowDeleteModal(true);
            }}
          >
            <UserRoundXIcon className="mr-2 h-4 w-4" />
            Delete account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteAccountModal
        isOpen={showDeleteModal}
        setIsOpen={setShowDeleteModal}
        onConfirm={handleDeleteProfile}
      />
    </>
  );
};

export default ProfileSettings;
