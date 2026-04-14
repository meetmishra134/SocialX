import { Bookmark, SquarePenIcon } from "lucide-react";
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
  const user = useAuth((state) => state.user);
  const isHomeActive =
    location.pathname.startsWith("/feed/foryou") ||
    location.pathname.startsWith("/feed/following");
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
            forceActive={isHomeActive}
          />
          <NavItems
            name="Connect"
            path="/connect"
            icon={(isActive) => <UsersIcon isFilled={isActive} size={25} />}
          />
          <NavItems
            name="Bookmarks"
            path="/bookmarks"
            icon={(isActive) => (
              <Bookmark size={25} fill={isActive ? "currentColor" : "none"} />
            )}
          />
          <NavItems
            name="Profile"
            path={`/profile/${user?.userName}`}
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
      <UserMenu />
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

        return `hover:bg-muted flex cursor-pointer items-start justify-center gap-3 rounded-full p-3 lg:justify-start lg:px-4 lg:py-2 ${
          actuallyActive
            ? "text-foreground bg-muted/50 font-semibold"
            : "text-foreground"
        }`;
      }}
    >
      {({ isActive }) => {
        const actuallyActive =
          forceActive !== undefined ? forceActive : isActive;

        return (
          <>
            {icon(actuallyActive)}
            <span className="hidden text-xl lg:block">{name}</span>
          </>
        );
      }}
    </NavLink>
  );
};

export default Navbar;
