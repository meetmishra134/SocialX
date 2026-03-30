import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useState } from "react";
import CreatePost from "../posts/CreatePost";

const Layout = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-12">
      <aside className="sticky top-0 col-span-2 h-screen border-r border-neutral-600 md:col-span-2 lg:col-span-3">
        <Navbar onOpenPost={() => setOpen(true)} />
      </aside>

      <main className="col-span-10 min-h-screen md:col-span-10 lg:col-span-6">
        <Outlet />
        <CreatePost open={open} setOpen={setOpen} />
      </main>

      <aside className="sticky top-0 hidden h-screen border-l border-neutral-600 lg:col-span-3 lg:block">
        <Footer />
      </aside>
    </div>
  );
};
export default Layout;
