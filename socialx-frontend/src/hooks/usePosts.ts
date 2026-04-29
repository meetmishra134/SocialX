import { postServices } from "@/services/post.services";
import { useInfiniteQuery } from "@tanstack/react-query";

export const usePosts = () => {
  return useInfiniteQuery({
    queryKey: ["GlobalFeed"],
    queryFn: async ({ pageParam }) => {
      const response = await postServices.getPost({
        pageParam: pageParam as number,
        limit: 10,
      });
      return response;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ?? undefined;
    },
  });
};
