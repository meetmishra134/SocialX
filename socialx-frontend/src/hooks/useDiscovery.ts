import { userService } from "@/services/user.services";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useDiscovery = () => {
  return useInfiniteQuery({
    queryKey: ["discover-users"],
    queryFn: ({ pageParam = 1 }) => userService.discoverUsers({ pageParam, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    staleTime: 1000 * 60 * 20,
  });
};
