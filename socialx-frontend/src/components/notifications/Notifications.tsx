import {
  Heart,
  MessageCircle,
  CheckCheck,
  BellRingIcon,
  Loader,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getRelativeTime } from "@/lib/relativeTime";
import { useNotifications } from "@/hooks/useNotifications";
import type { Notification } from "@/types/notification.types";

export default function NotificationsMenu() {
  const { notifications, isLoading, markAsRead } = useNotifications();

  const unreadCount =
    notifications?.filter((n: Notification) => !n.isRead).length || 0;

  return (
    <div className="bg-background relative flex h-full w-full flex-col overflow-hidden">
      <div className="border-border bg-background/80 sticky top-0 z-20 border-b p-4 backdrop-blur-md sm:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-foreground text-xl font-bold tracking-tight">
            Notifications
          </h1>

          {unreadCount > 0 && (
            <button
              className="group flex cursor-pointer items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-500 transition-colors hover:bg-blue-500/20"
              onClick={() => markAsRead()}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>
        <p className="text-muted-foreground mt-1.5 text-sm">
          See all notifications you probably missed
        </p>
      </div>

      {isLoading ? (
        <div className="flex min-h-[70vh] animate-spin items-center justify-center">
          <Loader className="text-muted-foreground h-8 w-8" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pb-20">
          <div className="mt-2 flex flex-col gap-1 px-2 sm:px-4">
            {notifications?.map((notif: Notification) => {
              const plainText = notif.post?.text?.replace(/<[^>]+>/g, "") || "";

              return (
                <div
                  key={notif._id}
                  className={`hover:bg-muted/50 flex items-start gap-4 rounded-xl bg-transparent p-3 transition-colors`}
                >
                  <div className="relative mt-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={notif.sender.avatarUrl?.url} />
                      <AvatarFallback>
                        {notif.sender.fullName[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={`border-background absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full border-2 text-white ${
                        notif.type === "like" || notif.type === "likeComment"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {notif.type === "like" || notif.type === "likeComment" ? (
                        <Heart className="h-2.5 w-2.5 fill-current" />
                      ) : (
                        <MessageCircle className="h-2.5 w-2.5 fill-current" />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-1 text-sm">
                    <p className="text-foreground leading-snug">
                      <span className="font-semibold">
                        {notif.sender.fullName}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {notif.type === "like"
                          ? "liked your post"
                          : notif.type === "comment"
                            ? "commented on your post"
                            : notif.type === "follow"
                              ? "started following you"
                              : "liked your comment"}
                      </span>
                    </p>

                    {plainText && (
                      <p className="border-muted text-muted-foreground line-clamp-1 border-l-2 text-xs">
                        "{plainText}"
                      </p>
                    )}

                    <span className="text-muted-foreground/80 mt-0.5 text-[11px]">
                      {getRelativeTime(notif.createdAt)}
                    </span>
                  </div>

                  {!notif.isRead && (
                    <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  )}
                </div>
              );
            })}

            {!isLoading && notifications?.length === 0 && (
              <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
                <div className="bg-muted/50 text-muted-foreground flex h-16 w-16 items-center justify-center rounded-full">
                  <BellRingIcon className="h-8 w-8 opacity-50" />
                </div>
                <p className="text-foreground mt-4 text-lg font-medium">
                  Nothing to see here yet
                </p>
                <p className="text-muted-foreground text-sm">
                  When someone interacts with you, you'll see it here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
