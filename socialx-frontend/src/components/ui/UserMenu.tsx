import { Ellipsis, LogOut, UserRoundXIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useAuth } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.services";
import { toast } from "sonner";
import { userService } from "@/services/user.services";
import { useState } from "react";
import { Skeleton } from "./skeleton";
import DeleteModal from "./DeleteModal";

const UserMenu = () => {
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const { fullName, userName, avatarUrl } =
    useAuth((state) => state.user) || {};
  const logout = useAuth((state) => state.logout);
  const isCheckingAuth = useAuth((state) => state.isCheckingAuth);
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
  if (isCheckingAuth) {
    return (
      <div className="mt-auto flex w-full items-center gap-2 rounded-full p-2">
        <Skeleton className="size-9 shrink-0 rounded-full sm:size-10" />
        <div className="hidden flex-1 flex-col gap-1 lg:flex">
          <Skeleton className="h-3.5 w-24 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
      </div>
    );
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="hover:bg-muted mt-auto flex w-full cursor-pointer items-center justify-center gap-2 rounded-full p-2 lg:justify-start">
            <Avatar className="size-9 sm:size-10">
              <AvatarImage
                src={avatarUrl?.url}
                alt="User"
                referrerPolicy="no-referrer"
              />
              <AvatarFallback>{fullName?.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="relative hidden flex-1 flex-col lg:flex">
              <p className="text-sm font-semibold">{fullName}</p>
              <p className="text-muted-foreground text-xs">{userName}</p>
              <button className="absolute top-1 right-0 cursor-pointer rounded-full">
                <Ellipsis />
              </button>
            </div>
          </div>
        </DropdownMenuTrigger>

        {/* moved outside trigger ↓ */}
        <DropdownMenuContent className="md:bg-popover bg-background/60 ml-2 w-56 rounded-md border p-1 shadow-lg backdrop-blur-md">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => handleLogout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setShowDeleteDialog(true)}
          >
            <UserRoundXIcon className="mr-2 h-4 w-4" />
            <span>Delete Account</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteModal
        title="Delete Account"
        description="You will lose all your data and posts. This action cannot be undone."
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        onConfirm={handleDeleteProfile}
      />
    </>
  );
};

export default UserMenu;
