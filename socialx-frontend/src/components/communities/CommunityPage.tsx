import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Users, FileText, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
  useDeleteCommunity,
  useGetCommunity,
  useGetCommunityNotifications,
  useJoinCommunity,
  useLeaveCommunity,
} from "@/hooks/useCommunity";
import { useAuth } from "@/store/authStore";
import { useState } from "react";

import { useCommunityNotification } from "@/hooks/useCommunityNotification";
import PostTab from "./PostTab";
import NotificationTab from "./NotificationTab";
import MembersTab from "./MembersTab";
import CommunitySettings from "./CommunitySettings";
import type { Notification } from "@/types/notification.types";

const colorMap: Record<string, { bg: string; text: string }> = {
  A: { bg: "#EEEDFE", text: "#534AB7" },
  B: { bg: "#E1F5EE", text: "#0F6E56" },
  C: { bg: "#EEEDFE", text: "#534AB7" },
  D: { bg: "#FAECE7", text: "#993C1D" },
  E: { bg: "#FBEAF0", text: "#993556" },
  default: { bg: "#EEEDFE", text: "#534AB7" },
};

const CommunityPage = () => {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const { communityId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  useCommunityNotification(communityId as string);
  const { data: community, isLoading, isError } = useGetCommunity(communityId!);

  const { mutate: joinCommunity, isPending: isJoining } = useJoinCommunity();
  const { mutate: leaveCommunity, isPending: isLeaving } = useLeaveCommunity();
  const { mutate: deleteCommunity, isPending: isDeleting } =
    useDeleteCommunity();
  const isJoined = community?.members?.some(
    (id: string) => id.toString() === user?._id,
  );

  const isCreator = community?.creator?.toString() === user?._id;
  const color =
    colorMap[community?.name?.[0]?.toUpperCase() ?? ""] ?? colorMap.default;
  const { data: notification } = useGetCommunityNotifications(
    communityId as string,
  );
  const notifications =
    notification?.pages
      .flatMap((page) =>
        Array.isArray(page) ? page : (page?.notifications ?? []),
      )
      .filter(
        (notification): notification is Notification => !!notification?._id,
      ) ?? [];
  const unreadNotificationCount = notifications.filter(
    (n: Notification) => !n.isRead,
  ).length;
  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="border-border bg-background/80 sticky top-0 z-20 border-b p-4 backdrop-blur-md">
          <div className="bg-muted h-6 w-32 animate-pulse rounded-lg" />
        </div>

        <div className="flex flex-col gap-4 p-6">
          <div className="bg-muted h-16 w-16 animate-pulse rounded-2xl" />
          <div className="bg-muted h-5 w-40 animate-pulse rounded-lg" />
          <div className="bg-muted h-4 w-64 animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (isError || !community) {
    return (
      <div className="text-muted-foreground flex min-h-screen items-center justify-center text-sm">
        Community not found
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="border-border bg-background/80 sticky top-0 z-20 flex items-center gap-3 border-b p-4 backdrop-blur-md sm:px-6">
        <button
          onClick={() => navigate(-1)}
          className="hover:bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-foreground truncate text-base font-bold">
            {community.name}
          </h1>
          <p className="text-muted-foreground text-xs">
            {community.membersCount.toLocaleString()}{" "}
            {community.membersCount === 1 ? "member" : "members"}
          </p>
        </div>

        {isCreator && (
          <CommunitySettings
            communityName={community.name}
            onDelete={() => deleteCommunity(community._id)}
            isDeleting={isDeleting}
          />
        )}
      </div>

      <div className="border-border border-b p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 rounded-2xl">
              <AvatarImage src={community.avatar?.url} />
              <AvatarFallback
                className="rounded-2xl text-2xl font-medium"
                style={{ background: color.bg, color: color.text }}
              >
                {community.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <h2 className="text-foreground text-lg leading-tight font-bold">
                {community.name}
              </h2>
              {community.description && (
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {community.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-5">
          <div className="flex items-center gap-1.5">
            <Users className="text-muted-foreground h-4 w-4" />
            <span className="text-sm font-medium">
              {community.membersCount.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-sm">
              {community.membersCount === 1 ? "member" : "members"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="text-muted-foreground h-4 w-4" />
            <span className="text-sm font-medium">{community.postsCount}</span>
            <span className="text-muted-foreground text-sm">posts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="text-muted-foreground h-4 w-4" />
            <span className="text-foreground text-sm">
              {new Date(community.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {!isCreator && (
          <div className="mt-4">
            {isJoined ? (
              <Button
                variant="outline"
                size="sm"
                disabled={isLeaving}
                onClick={() => leaveCommunity(community._id)}
                className="rounded-full px-6"
              >
                Leave community
              </Button>
            ) : (
              <Button
                size="sm"
                disabled={isJoining}
                onClick={() => joinCommunity(community._id)}
                className="rounded-full px-6"
              >
                Join community
              </Button>
            )}
          </div>
        )}

        {isCreator && (
          <div className="mt-4">
            <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs">
              You created this community
            </span>
          </div>
        )}
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="border-border h-auto w-full justify-start gap-0 rounded-none border-b bg-transparent p-0">
          {["posts", "members"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground rounded-none border-b-2 border-transparent px-5 py-3 text-sm capitalize transition-colors"
            >
              {tab}
            </TabsTrigger>
          ))}
          {isJoined && (
            <TabsTrigger
              key="updates "
              value="updates"
              className="data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground rounded-none border-b-2 border-transparent px-5 py-3 text-sm capitalize transition-colors"
            >
              updates
              {unreadNotificationCount > 0 && (
                <span className="bg-primary text-primary-foreground ml-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium">
                  {unreadNotificationCount > 99
                    ? "99+"
                    : unreadNotificationCount}
                </span>
              )}
            </TabsTrigger>
          )}
        </TabsList>
        <PostTab
          communityId={community._id}
          isJoined={isJoined}
          isComposerOpen={isComposerOpen}
          setIsComposerOpen={setIsComposerOpen}
          isCreator={isCreator}
          community={community}
        />

        <MembersTab
          communityId={community._id}
          community={community}
          isCreator={isCreator}
        />

        <NotificationTab community={community} communityId={community._id} />
      </Tabs>
    </div>
  );
};

export default CommunityPage;
