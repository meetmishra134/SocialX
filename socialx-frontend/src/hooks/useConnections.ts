import { userService } from "@/services/user.services";
import { useQuery } from "@tanstack/react-query";

export const useFollowers = (userName: string | undefined) => {
  return useQuery({
    queryKey: ["followers", userName],
    queryFn: () => userService.getFollowers(userName as string),
    staleTime: 5 * 60 * 1000,
    enabled: !!userName,
  });
};
export const useFollowing = (userName: string | undefined) => {
  return useQuery({
    queryKey: ["following", userName],
    queryFn: () => userService.getFollowing(userName as string),
    staleTime: 5 * 60 * 1000,
    enabled: !!userName,
  });
};
