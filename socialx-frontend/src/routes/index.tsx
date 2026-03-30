import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import Layout from "@/components/layout/Layout";
import FeedTab from "@/components/feed/FeedTab";

import Bookmarks from "@/components/Bookmarks/Bookmarks";
import Connect from "@/components/connect/Connect";
import Profile from "@/components/Profile/Profile";
import FollowersPage from "@/components/Profile/FollowersPage";
import FollowingPage from "@/components/Profile/FollowingPage";
import GlobalFeed from "@/components/feed/GlobalFeed";
import FollowingFeed from "@/components/feed/FollowingFeed";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: "/home",
            element: <FeedTab />,
            children: [
              {
                path: "foryou",
                element: <GlobalFeed />,
              },
              {
                path: "following",
                element: <FollowingFeed />,
              },
            ],
          },
          {
            path: "/bookmarks",
            element: <Bookmarks />,
          },
          {
            path: "/profile",
            element: <Profile />,
            children: [
              {
                path: "followers",
                element: <FollowersPage />,
              },
              {
                path: "following",
                element: <FollowingPage />,
              },
            ],
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
