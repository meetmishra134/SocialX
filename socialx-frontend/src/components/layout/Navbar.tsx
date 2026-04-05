import { Ellipsis, LogOut, SquarePenIcon } from "lucide-react";
import type { JSX } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth } from "@/store/authStore";
import { toast } from "sonner";
import HomeIcon from "../icons/HomeIcon";
import UsersIcon from "../icons/UsersIcon";
import BookmarkIcon from "../icons/BookmarkIcon";
import UserIcon from "../icons/UserIcon";
import { authService } from "@/services/auth.services";

interface NavbarProps {
  onOpenPost: () => void;
}

const Navbar = ({ onOpenPost }: NavbarProps) => {
  const { fullName, userName } = useAuth((state) => state.user) || {};
  const logout = useAuth((state) => state.logout);
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
  return (
    <nav className="flex h-full w-full flex-col items-center py-4 lg:items-start lg:p-4">
      <Link
        to="/feed/foryou"
        className="flex w-full items-center justify-center gap-2 lg:justify-start lg:px-4"
      >
        <img
          src="../../../images/XLogo.png"
          alt="SocialX"
          className="h-8 w-auto lg:h-10"
        />
        <h1 className="hidden text-2xl font-bold lg:block">SocialX</h1>
      </Link>

      <div className="w-full">
        <ul className="mt-6 flex flex-col gap-4 px-2 lg:px-4">
          <NavItems
            name="Home"
            path="/feed/foryou"
            icon={(isActive) => <HomeIcon isFilled={isActive} size={25} />}
          />
          <NavItems
            name="Connect"
            path="/connect"
            icon={(isActive) => <UsersIcon isFilled={isActive} size={25} />}
          />
          <NavItems
            name="Bookmarks"
            path="/bookmarks"
            icon={(isActive) => <BookmarkIcon isFilled={isActive} size={25} />}
          />
          <NavItems
            name="Profile"
            path="/profile"
            icon={(isActive) => <UserIcon isFilled={isActive} size={25} />}
          />
        </ul>
      </div>

      <div className="mt-4 w-full px-2 lg:px-4">
        <Button
          className="w-full cursor-pointer rounded-full font-bold"
          onClick={onOpenPost}
        >
          <span className="hidden lg:inline">Post</span>
          <span className="lg:hidden">
            <SquarePenIcon size={35} />
          </span>
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="hover:bg-muted mt-auto flex w-full cursor-pointer items-center justify-center gap-2 rounded-full p-2 lg:justify-start">
            <Avatar size="lg">
              <AvatarImage alt="User" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="relative hidden flex-1 flex-col lg:flex">
              <p className="text-sm font-semibold">{fullName}</p>
              <p className="text-muted-foreground text-xs">{userName}</p>

              <button className="absolute top-1 right-0 cursor-pointer rounded-full">
                <Ellipsis />
              </button>

              <DropdownMenuContent className="md:bg-popover ml-2 w-32 min-w-0 rounded-md border p-1 shadow-lg">
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                  onSelect={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                >
                  <LogOut />
                  <span>Logout </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </div>
          </div>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </nav>
  );
};

interface NavItemsProps {
  name: string;
  path: string;
  icon: (isActive: boolean) => JSX.Element;
}

const NavItems = ({ name, path, icon }: NavItemsProps) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `hover:bg-muted flex cursor-pointer items-start justify-center gap-3 rounded-full p-3 lg:justify-start lg:px-4 lg:py-2 ${
          isActive
            ? "text-foreground bg-muted/50 font-semibold"
            : "text-foreground"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {icon(isActive)}
          <span className="hidden text-xl lg:block">{name}</span>
        </>
      )}
    </NavLink>
  );
};

export default Navbar;
