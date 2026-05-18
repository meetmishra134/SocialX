import {
  ArrowDownIcon,
  Bell,
  CheckCheck,
  FileText,
  Loader,
  Megaphone,
} from "lucide-react";
import { TabsContent } from "../ui/tabs";
import {
  useGetCommunityNotifications,
  useMarkCommunityNotificationsAsRead,
} from "@/hooks/useCommunity";
import type { Notification } from "@/types/notification.types";
import type { Community } from "@/types/community.types";
import { getRelativeTime } from "@/lib/relativeTime";
interface NotificationTabProps {
  communityId: string;
  community: Community;
}
const NotificationTab = ({ communityId, community }: NotificationTabProps) => {
  const {
    data: notification,
    hasNextPage: hasNotificationNext,
    isLoading: isNotificationLoading,
    isError: isNotificationError,
    isFetchingNextPage: isNotificationFetchingNextPage,
    fetchNextPage: fetchNotificationNextPage,
  } = useGetCommunityNotifications(communityId as string);
  const notifications =
    notification?.pages
      .flatMap((page) =>
        Array.isArray(page) ? page : (page?.notifications ?? []),
      )
      .filter(
        (notification): notification is Notification => !!notification?._id,
      ) ?? [];
  const { mutate: markAsRead } = useMarkCommunityNotificationsAsRead(
    communityId as string,
  );
  const plainText = notifications[0]?.post?.text?.replace(/<[^>]+>/g, "") || "";
  const unreadCount = notifications.filter(
    (n: Notification) => !n.isRead,
  ).length;
  return (
    <TabsContent value="updates" className="mt-0 outline-none">
      {isNotificationLoading ? (
        <div className="flex items-center justify-center gap-3 py-12">
          <Loader className="text-muted-foreground mx-auto animate-spin" />
        </div>
      ) : isNotificationError ? (
        <p className="text-muted-foreground py-12 text-center text-sm">
          Failed to load updates
        </p>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-muted mb-3 flex h-14 w-14 items-center justify-center rounded-full">
            <Bell className="text-muted-foreground h-7 w-7 opacity-50" />
          </div>
          <p className="text-foreground text-base font-medium">
            You're all caught up!
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            No new updates in this community right now.
          </p>
        </div>
      ) : (
        <div className="divide-border flex flex-col divide-y">
          {unreadCount > 0 && (
            <div className="flex justify-end px-5 py-3">
              <button
                onClick={() => markAsRead()}
                className="flex cursor-pointer items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-500 transition-colors hover:bg-blue-500/20"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark all as read</span>
              </button>
            </div>
          )}

          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="hover:bg-muted/40 flex cursor-pointer items-start gap-4 px-5 py-4 transition-colors"
            >
              <div className="bg-primary/10 mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                {notification.type === "community_post" ? (
                  <FileText className="text-primary h-5 w-5" />
                ) : (
                  <Megaphone className="text-primary h-5 w-5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-foreground text-sm leading-relaxed">
                  <span className="font-semibold">
                    {notification.sender.fullName}
                  </span>{" "}
                  <span className="text-muted-foreground">
                    {notification.type === "community_post"
                      ? "posted in"
                      : "update in"}{" "}
                    {community.name}
                  </span>
                </p>
                {plainText && (
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-300">
                    "{plainText}"
                  </p>
                )}
                {notification.createdAt && (
                  <span className="text-muted-foreground mt-1.5 ml-0.5 block text-xs">
                    {getRelativeTime(notification.createdAt)}
                  </span>
                )}
              </div>

              {!notification.isRead && (
                <div className="bg-primary mt-2 h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              )}
            </div>
          ))}

          <div className="flex w-full justify-center py-6">
            {hasNotificationNext && (
              <button
                onClick={() => fetchNotificationNextPage()}
                disabled={isNotificationFetchingNextPage}
                className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer rounded-full px-6 py-2.5 text-sm font-semibold transition disabled:opacity-50"
              >
                {isNotificationFetchingNextPage ? (
                  <Loader className="animate-spin" />
                ) : (
                  <ArrowDownIcon className="animate-bounce" />
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </TabsContent>
  );
};

export default NotificationTab;
