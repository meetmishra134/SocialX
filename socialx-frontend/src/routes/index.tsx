import { lazy, Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import Layout from "@/components/layout/Layout";
import FeedTab from "@/components/feed/FeedTab";
import PageNotFound from "@/components/ui/PageNotFound";
import { Loader } from "lucide-react";
import FeedSkeleton from "@/components/ui/FeedSkeleton";
import ProfileSkeleton from "@/components/ui/ProfileSkeleton";

const RegisterForm = lazy(() => import("@/components/auth/RegisterForm"));
const Bookmarks = lazy(() => import("@/components/Bookmarks/BookmarksPage"));
const Connect = lazy(() => import("@/components/connect/Connect"));
const Profile = lazy(() => import("@/components/Profile/Profile"));
const Notifications = lazy(
  () => import("@/components/notifications/Notifications"),
);
const DetailedPost = lazy(() => import("@/components/posts/DetailedPost"));
const ResetPassword = lazy(() => import("@/components/auth/ResetPassword"));
const FollowersPage = lazy(() => import("@/components/Profile/FollowersPage"));
const FollowingPage = lazy(() => import("@/components/Profile/FollowingPage"));
const GlobalFeed = lazy(() => import("@/components/feed/GlobalFeed"));
const FollowingFeed = lazy(() => import("@/components/feed/FollowingFeed"));
const VerifyEmail = lazy(() => import("@/components/auth/VerifyEmail"));
const ForgotPasswordPending = lazy(
  () => import("@/components/auth/ForgotPasswordPending"),
);

const TopicFeed = lazy(() => import("@/components/feed/TopicFeed"));

export const withSuspense = (
  Component: React.ReactElement,
): React.ReactElement => (
  <Suspense
    fallback={
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader size={25} />
      </div>
    }
  >
    {Component}
  </Suspense>
);

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
            path: "/topic/:topic",
            element: withSuspense(<TopicFeed />),
          },
          {
            path: "/post/:postId",
            element: withSuspense(<DetailedPost />),
          },
          {
            path: "feed",
            element: <FeedTab />,
            children: [
              {
                path: "foryou",
                element: (
                  <Suspense fallback={<FeedSkeleton />}>
                    <GlobalFeed />
                  </Suspense>
                ),
              },
              {
                path: "following",
                element: (
                  <Suspense fallback={<FeedSkeleton />}>
                    <FollowingFeed />
                  </Suspense>
                ),
              },
            ],
          },

          {
            path: "/bookmarks",
            element: withSuspense(<Bookmarks />),
          },
          {
            path: "/notifications",
            element: withSuspense(<Notifications />),
          },
          {
            path: "profile/:userId",
            element: (
              <Suspense fallback={<ProfileSkeleton />}>
                <Profile />
              </Suspense>
            ),

            children: [
              {
                path: "followers",
                element: withSuspense(<FollowersPage />),
              },
              {
                path: "following",
                element: withSuspense(<FollowingPage />),
              },
            ],
          },
          {
            path: "connect",
            element: withSuspense(<Connect />),
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
    element: withSuspense(<RegisterForm />),
  },

  {
    path: "/verify-email",
    element: withSuspense(<VerifyEmail />),
  },
  {
    path: "/forgot-password",
    element: withSuspense(<ForgotPasswordPending />),
  },
  {
    path: "/reset-password",
    element: withSuspense(<ResetPassword />),
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);
