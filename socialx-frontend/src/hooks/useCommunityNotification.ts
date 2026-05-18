import { socket } from "@/lib/socket";
import type { Notification } from "@/types/notification.types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export const useCommunityNotification = (communityId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!communityId) return;

    socket.emit("join-community", communityId);

    const handleNotification = (data: Notification) => {
      if (data.type === "community_post" && data.communityId === communityId) {
        toast(`📢 ${data.sender?.fullName} posted in the community`, {
          position: "top-center",
          description: "New post added",
          action: {
            label: "View",
            onClick: () => {
              queryClient.invalidateQueries({
                queryKey: ["community-posts", communityId],
              });
            },
          },
          onDismiss: () => {
            queryClient.invalidateQueries({
              queryKey: ["community-posts", communityId],
            });
          },
          onAutoClose: () => {
            queryClient.invalidateQueries({
              queryKey: ["community-posts", communityId],
            });
          },
        });

        queryClient.invalidateQueries({
          queryKey: ["community-notifications", communityId],
        });
      }
    };

    socket.off("community-notification", handleNotification);
    socket.on("community-notification", handleNotification);

    return () => {
      socket.emit("leave-community", communityId);
      socket.off("community-notification", handleNotification);
    };
  }, [communityId, queryClient]);
};
