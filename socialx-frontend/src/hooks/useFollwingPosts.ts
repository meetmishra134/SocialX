import { postServices } from "@/services/post.services";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useFollowingPosts = () => {
  return useInfiniteQuery({
    queryKey: ["FollowingFeed"],
    queryFn: async ({ pageParam }) => {
      const response = await postServices.getFollowingPosts({
        pageParam: pageParam as number,
        limit: 10,
      });

      return response;
    },
    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ?? undefined;
    },
  });
};
