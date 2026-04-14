import { userService } from "@/services/user.services";
import { useQuery } from "@tanstack/react-query";

export const useProfileData = (userName: string | undefined) => {
  return useQuery({
    queryKey: ["profile", userName],
    queryFn: () => userService.getUserProfile(userName as string),
    enabled: !!userName,
    staleTime: 5 * 60 * 1000,
  });
};
