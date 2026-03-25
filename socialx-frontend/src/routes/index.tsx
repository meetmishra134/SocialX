import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import Layout from "@/components/layout/Layout";
import Feed from "@/components/feed/Feed";

import Bookmarks from "@/components/Bookmarks/Bookmarks";
import Connect from "@/components/connect/Connect";
import Profile from "@/components/Profile/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Feed />,
          },
          {
            path: "/bookmarks",
            element: <Bookmarks />,
          },
          {
            path: "/profile",
            element: <Profile />,
          },
          {
            path: "/connect",
            element: <Connect />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/register",
    element: <RegisterForm />,
  },
]);
