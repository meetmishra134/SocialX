import { postServices } from "@/services/post.services";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useSearch = (topic: string | undefined) => {
  return useInfiniteQuery({
    queryKey: ["GlobalFeed", "topic", topic],
    queryFn: ({ pageParam }) =>
      postServices.fetchPostsByTopic({
        pageParam,
        limit: 10,
        topic: topic as string,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ?? undefined;
    },
    enabled: !!topic,
  });
};
