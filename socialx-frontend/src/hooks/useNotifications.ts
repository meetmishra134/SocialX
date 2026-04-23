import { userService } from "@/services/user.services";
import type { Notification } from "@/types/notification.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: userService.getUserNotification,
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: userService.markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
  return { notifications, isLoading, markAsRead };
};
