import { userService } from "@/services/user.services";
import { useQuery } from "@tanstack/react-query";

export const useProfileData = (userId: string) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => userService.getUserProfile(userId as string),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
};
