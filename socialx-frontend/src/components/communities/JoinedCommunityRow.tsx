import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { CommunityCardProps } from "./CommunityCard";
import { useGetCommunityNotifications } from "@/hooks/useCommunity";
import type { Notification } from "@/types/notification.types";

const colorMap: Record<string, { bg: string; text: string }> = {
  A: { bg: "#EEEDFE", text: "#534AB7" },
  B: { bg: "#E1F5EE", text: "#0F6E56" },
  C: { bg: "#EEEDFE", text: "#534AB7" },
  D: { bg: "#FAECE7", text: "#993C1D" },
  E: { bg: "#FBEAF0", text: "#993556" },
  default: { bg: "#EEEDFE", text: "#534AB7" },
};

const JoinedCommunityRow = ({ community }: CommunityCardProps) => {
  const navigate = useNavigate();
  const color = colorMap[community.name[0].toUpperCase()] ?? colorMap.default;
  const { data: notification } = useGetCommunityNotifications(
    community._id as string,
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
  return (
    <div
      onClick={() => navigate(`/communities/${community._id}`)}
      className="group border-border hover:bg-muted/40 flex cursor-pointer items-center gap-4 rounded-2xl border p-3.5 transition-all duration-200"
    >
      {/* avatar */}
      <Avatar className="h-11 w-11 rounded-xl">
        <AvatarImage src={community.avatar?.url} />
        <AvatarFallback
          className="rounded-xl text-base font-medium"
          style={{ background: color.bg, color: color.text }}
        >
          {community.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* info */}
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 truncate text-sm leading-tight font-medium">
          {community.name} {""}
          {unreadNotificationCount > 0 && (
            <span className="bg-primary text-primary-foreground flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-medium">
              {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
            </span>
          )}
        </p>

        <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
          <Users className="h-3 w-3" />
          <span>{community.membersCount.toLocaleString()} members</span>
          <span className="mx-1">·</span>
          <span>{community.postsCount} posts</span>
        </div>
      </div>

      <div className="text-muted-foreground translate-x-0 transition-transform duration-200 group-hover:translate-x-1">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M6 3l5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default JoinedCommunityRow;
