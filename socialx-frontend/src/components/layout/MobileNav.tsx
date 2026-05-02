import { Link, useLocation } from "react-router-dom";
import HomeIcon from "../icons/HomeIcon";
import UsersIcon from "../icons/UsersIcon";
import UserIcon from "../icons/UserIcon";
import BellRing from "../icons/BellRing";

import { useAuth } from "@/store/authStore";
import { useNotifications } from "@/hooks/useNotifications";
import { Bookmark } from "lucide-react";

const MobileNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { notifications } = useNotifications();

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;
  const isHomeActive = location.pathname.startsWith("/feed");

  return (
    <nav className="bg-background/80 pb-safe fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-between border-t border-neutral-700 backdrop-blur-md sm:hidden">
      <Link
        to="/feed/foryou"
        className="flex flex-1 flex-col items-center justify-center gap-0.5 text-xs"
      >
        <HomeIcon isFilled={isHomeActive} size={24} />
        <span className="text-[11px]">Home</span>
      </Link>

      <Link
        to="/connect"
        className="mr-1 flex flex-1 flex-col items-center justify-center gap-0.5 text-xs"
      >
        <UsersIcon isFilled={location.pathname === "/connect"} size={24} />
        <span className="text-[11px]">Connect</span>
      </Link>

      <Link
        to="/bookmarks"
        className="flex flex-1 flex-col items-center justify-center gap-0.5 text-xs"
      >
        <Bookmark
          fill={
            location.pathname.includes("/bookmarks") ? "currentColor" : "none"
          }
        />
        <span className="text-[11px]">Bookmarks</span>
      </Link>

      {/* Notifications */}
      <Link
        to="/notifications"
        className="relative flex flex-1 flex-col items-center justify-center gap-0.5 text-xs"
      >
        <BellRing
          isFilled={location.pathname.includes("/notifications")}
          size={24}
          unreadCount={unreadCount}
        />
        <span className="text-[11px]">Notifications</span>
      </Link>

      {/* Profile */}
      <Link
        to={user ? `/profile/${user._id}` : "/login"}
        className="flex flex-1 flex-col items-center justify-center gap-0.5 text-xs"
      >
        <UserIcon isFilled={location.pathname.includes("/profile")} size={24} />
        <span className="text-[11px]">Profile</span>
      </Link>
    </nav>
  );
};

export default MobileNav;
