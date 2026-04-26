import { BellRing, Bookmark, SquarePenIcon } from "lucide-react";
import type { JSX } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "../ui/button";

import HomeIcon from "../icons/HomeIcon";
import UsersIcon from "../icons/UsersIcon";
import UserIcon from "../icons/UserIcon";
import UserMenu from "../ui/UserMenu";
import { useAuth } from "@/store/authStore";

interface NavbarProps {
  onOpenPost: () => void;
}

const Navbar = ({ onOpenPost }: NavbarProps) => {
  const location = useLocation();
  const { user, openVerifyPopup } = useAuth();

  const isHomeActive =
    location.pathname.startsWith("/feed/foryou") ||
    location.pathname.startsWith("/feed/following");

  return (
    <nav className="flex h-full w-full flex-col items-center py-2 lg:items-start lg:px-4">
      <Link
        to="/feed/foryou"
        className="mb-2 flex w-fit items-center gap-2 rounded-full p-2.5"
      >
        <img
          src="../../../images/SocialXLogo.png"
          alt="SocialX"
          className="h-10 w-auto lg:h-12"
        />
        <h1 className="hidden text-2xl font-bold lg:block">SocialX</h1>
      </Link>

      <div className="flex w-full flex-1 flex-col items-center lg:items-start">
        <ul className="flex w-full flex-col items-center gap-1 lg:items-start">
          <NavItems
            name="Home"
            path="/feed/foryou"
            icon={(isActive) => <HomeIcon isFilled={isActive} size={27} />}
            forceActive={isHomeActive}
          />
          <NavItems
            name="Connect"
            path="/connect"
            icon={(isActive) => <UsersIcon isFilled={isActive} size={27} />}
          />
          <NavItems
            name="Bookmarks"
            path="/bookmarks"
            icon={(isActive) => (
              <Bookmark size={27} fill={isActive ? "currentColor" : "none"} />
            )}
          />
          <NavItems
            name="Notifications"
            path="/notifications"
            icon={(isActive) => (
              <BellRing size={27} fill={isActive ? "currentColor" : "none"} />
            )}
          />
          <NavItems
            name="Profile"
            path={`/profile/${user?._id}`}
            icon={(isActive) => <UserIcon isFilled={isActive} size={27} />}
          />
        </ul>

        <Button
          className="mt-4 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full lg:h-10 lg:w-[90%] lg:justify-center"
          onClick={user?.isEmailVerified ? onOpenPost : openVerifyPopup}
        >
          <span className="hidden text-lg font-bold lg:inline">Post</span>
          <span className="lg:hidden">
            <SquarePenIcon size={24} />
          </span>
        </Button>
      </div>

      <div className="mt-auto w-full pb-4">
        <UserMenu />
      </div>
    </nav>
  );
};

interface NavItemsProps {
  name: string;
  path: string;
  icon: (isActive: boolean) => JSX.Element;
  forceActive?: boolean;
}

const NavItems = ({ name, path, icon, forceActive }: NavItemsProps) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) => {
        const actuallyActive =
          forceActive !== undefined ? forceActive : isActive;

        return `group flex w-fit items-center gap-5 rounded-full p-3 transition-colors ${
          actuallyActive
            ? "bg-muted text-foreground font-bold" // Active state stands out more
            : "text-foreground hover:bg-muted/60"
        }`;
      }}
    >
      {({ isActive }) => {
        const actuallyActive =
          forceActive !== undefined ? forceActive : isActive;

        return (
          <>
            <div className="flex items-center justify-center transition-transform group-hover:scale-105">
              {icon(actuallyActive)}
            </div>

            <span className="hidden text-[1.25rem] lg:block lg:pr-4">
              {name}
            </span>
          </>
        );
      }}
    </NavLink>
  );
};

export default Navbar;
