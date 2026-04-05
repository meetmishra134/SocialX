import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { createBrowserRouter, Navigate } from "react-router-dom";
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
import ConnectTab from "@/components/connect/ConnectTab";
import ConnectRequests from "@/components/connect/ConnectRequests";
import VerifyEmail from "@/components/auth/VerifyEmail";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Navigate to="/feed/foryou" replace />,
          },
          {
            path: "feed",
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
            path: "profile",
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
            path: "connect",
            element: <ConnectTab />,
            children: [
              {
                index: true,
                element: <Connect />,
              },
              {
                path: "requests",
                element: <ConnectRequests />,
              },
            ],
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
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
]);
