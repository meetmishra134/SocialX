import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useState } from "react";
import CreatePost from "../posts/CreatePost";
import { useAuth } from "@/store/authStore";
import PendingVerification from "../auth/PendingVerification";
import MobileNav from "./MobileNav";
import { SquarePenIcon } from "lucide-react";

const Layout = () => {
  const { user } = useAuth() || {};
  const [open, setOpen] = useState<boolean>(false);

  const handleOpenPost = () => {
    setOpen(true);
  };

  return (
    <div className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-12">
      <aside className="sticky top-0 hidden h-screen border-r border-neutral-600 sm:col-span-2 sm:block lg:col-span-3">
        <Navbar onOpenPost={handleOpenPost} />
      </aside>

      <main className="relative col-span-12 min-h-screen pb-16 sm:col-span-10 sm:pb-0 lg:col-span-6">
        <Outlet />
        <CreatePost open={open} setOpen={setOpen} />
        {user && !user.isEmailVerified && <PendingVerification />}

        <button
          onClick={handleOpenPost}
          className="bg-primary text-primary-foreground fixed right-4 bottom-18 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 sm:hidden"
        >
          <SquarePenIcon size={24} />
        </button>
      </main>

      <aside className="sticky top-0 hidden h-screen border-l border-neutral-600 lg:col-span-3 lg:block">
        <Footer />
      </aside>

      <MobileNav />
    </div>
  );
};

export default Layout;
