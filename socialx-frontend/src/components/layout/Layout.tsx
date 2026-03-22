import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-12">
      <aside className="sticky top-0 col-span-2 h-screen border-r border-neutral-600 lg:col-span-3">
        <Navbar />
      </aside>
      <main className="col-span-10 min-h-screen lg:col-span-6">
        <Outlet />
      </main>
      <aside className="sticky top-0 col-span-3 hidden h-screen border-l border-neutral-600 lg:block">
        <Footer />
      </aside>
    </div>
  );
};

export default Layout;
