import {
  Bookmark,
  Ellipsis,
  HomeIcon,
  LogOut,
  SquarePenIcon,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { JSX } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Navbar = () => {
  return (
    <nav className="flex h-full w-full flex-col items-center py-4 lg:items-start lg:p-4">
      <div className="flex w-full items-center justify-center gap-2 lg:justify-start lg:px-4">
        <img
          src="../../../images/XLogo.png"
          alt="SocialX"
          className="h-8 w-auto lg:h-10"
        />
        <h1 className="hidden text-2xl font-bold lg:block">SocialX</h1>
      </div>

      <div className="w-full">
        <ul className="mt-6 flex flex-col gap-4 px-2 lg:px-4">
          <NavItems name="Home" path="/" icon={<HomeIcon size={25} />} />
          <NavItems
            name="Connect"
            path="/connect"
            icon={<UsersRound size={25} />}
          />
          <NavItems
            name="Bookmarks"
            path="/bookmarks"
            icon={<Bookmark size={25} />}
          />
          <NavItems
            name="Profile"
            path="/profile"
            icon={<UserRound size={25} />}
          />
        </ul>
      </div>

      <div className="mt-4 w-full px-2 lg:px-4">
        <Button className="w-full cursor-pointer rounded-full font-bold">
          <span className="hidden lg:inline">Post</span>
          <span className="lg:hidden">
            <SquarePenIcon size={30} />
          </span>
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="hover:bg-muted mt-auto flex w-full cursor-pointer items-center justify-center gap-2 rounded-full p-2 lg:justify-start">
            <Avatar size="lg">
              <AvatarImage
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSefW2T8BGhHrcrEOgGMOMpKgBKMahj9ClYDQ&s"
                alt="User"
              />
              <AvatarFallback>CN</AvatarFallback>
              <AvatarBadge className="bg-green-600" />
            </Avatar>

            <div className="relative hidden flex-1 flex-col lg:flex">
              <p className="text-sm font-semibold">Meet Mishra</p>
              <p className="text-muted-foreground text-xs">mishrameet@123</p>

              <Button
                variant="outline"
                size="icon"
                className="absolute top-0 right-0"
              >
                <Ellipsis />
              </Button>

              <DropdownMenuContent className="ml-2 w-32 min-w-0">
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                >
                  <LogOut />
                  Logout
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
  icon: JSX.Element;
}

const NavItems = ({ name, path, icon }: NavItemsProps) => {
  return (
    <NavLink
      to={path}
      className="hover:bg-muted flex cursor-pointer items-center justify-center gap-3 rounded-full p-3 lg:justify-start lg:px-4 lg:py-2"
    >
      {icon}
      <span className="hidden text-xl lg:block">{name}</span>
    </NavLink>
  );
};

export default Navbar;
