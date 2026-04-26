import { useAuth } from "@/store/authStore";
import type { Notification } from "@/types/notification.types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";

export const useSocketNotification = () => {
  const user = useAuth((state) => state.user);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!user?._id) return;
    const socket = io(import.meta.env.VITE_SERVER_URL);
    socket.emit("join_own_room", user._id);
    socket.on("new_notification", (notification: Notification) => {
      let message = "";
      if (notification.type === "like") {
        message = `❤️${notification.sender?.fullName} liked your post.`;
      } else if (notification.type === "comment") {
        message = `💬${notification.sender?.fullName} commented on your post.`;
      } else if (notification.type === "follow") {
        message = `${notification.sender?.fullName} started following you.`;
        queryClient.invalidateQueries({ queryKey: ["followers"] });
        queryClient.invalidateQueries({ queryKey: ["profile", user._id] });
      } else if (notification.type === "likeComment") {
        message = `❤️${notification.sender?.fullName} liked your comment.`;
      }
      if (message) {
        toast(message, { position: "top-right" });
      }
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });
    return () => {
      socket.off("new_notification");
      socket.disconnect();
    };
  }, [user?._id, queryClient]);
};
