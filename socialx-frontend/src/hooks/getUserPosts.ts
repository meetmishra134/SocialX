import { postServices } from "@/services/post.services";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useGetUserPosts = (userId: string | undefined) => {
  return useInfiniteQuery({
    queryKey: ["userPosts", userId],
    queryFn: ({ pageParam }) =>
      postServices.getUserPosts({
        userId: userId as string,
        pageParam,
        limit: 3,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ?? undefined;
    },
    enabled: !!userId,
    staleTime: 0,
  });
};
