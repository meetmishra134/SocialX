import { Link, useLocation } from "react-router-dom";
import HomeIcon from "../icons/HomeIcon";
import UserIcon from "../icons/UserIcon";
import BellRing from "../icons/BellRing";
import { useAuth } from "@/store/authStore";
import { useNotifications } from "@/hooks/useNotifications";
import { Compass } from "lucide-react";
import UsersIcon from "../icons/UsersIcon";

const MobileNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { notifications } = useNotifications();

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;
  const isHomeActive = location.pathname.startsWith("/feed");

  const navClass = (path: string) =>
    `flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors duration-200 ${
      location.pathname.includes(path)
        ? "text-primary"
        : "text-muted-foreground"
    }`;

  return (
    <nav className="bg-background/80 pb-safe fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-between border-t border-neutral-700 backdrop-blur-md sm:hidden">
      <Link
        to="/feed/foryou"
        className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors duration-200 ${
          isHomeActive ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <HomeIcon isFilled={isHomeActive} size={24} />
        <span className="text-[11px]">Home</span>
      </Link>

      <Link to="/explore" className={navClass("/explore")}>
        <Compass
          strokeWidth={location.pathname.includes("/explore") ? 2.5 : 1.5}
          size={24}
        />
        <span className="text-[11px]">Explore</span>
      </Link>

      <Link to="/myCommunities" className={navClass("/myCommunities")}>
        <UsersIcon
          size={24}
          isFilled={location.pathname.includes("/myCommunities")}
        />
        <span className="text-[11px]">Community</span>
      </Link>

      <Link to="/notifications" className={navClass("/notifications")}>
        <BellRing
          isFilled={location.pathname.includes("/notifications")}
          size={24}
          unreadCount={unreadCount}
        />
        <span className="text-[11px]">Alerts</span>
      </Link>

      <Link
        to={user ? `/profile/${user._id}` : "/login"}
        className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors duration-200 ${
          location.pathname.includes("/profile")
            ? "text-primary"
            : "text-muted-foreground"
        }`}
      >
        <UserIcon isFilled={location.pathname.includes("/profile")} size={24} />
        <span className="text-[11px]">Profile</span>
      </Link>
    </nav>
  );
};

export default MobileNav;
