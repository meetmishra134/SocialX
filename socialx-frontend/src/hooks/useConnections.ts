import { userService } from "@/services/user.services";
import { useQuery } from "@tanstack/react-query";

export const useFollowers = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["followers", userId],
    queryFn: () => userService.getFollowers(userId as string),
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });
};
export const useFollowing = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["following", userId],
    queryFn: () => userService.getFollowing(userId as string),
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });
};
