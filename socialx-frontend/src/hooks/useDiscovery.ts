import { userService } from "@/services/user.services";
import { useQuery } from "@tanstack/react-query";

export const useDiscovery = () => {
  return useQuery({
    queryKey: ["discover-users"],
    queryFn: () => userService.discoverUsers(),
    staleTime: 1000 * 60 * 5, //
  });
};
