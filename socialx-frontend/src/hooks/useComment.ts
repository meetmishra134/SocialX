import { commentServices } from "@/services/comment.services";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useComment = (postId: string | undefined) => {
  return useInfiniteQuery({
    queryKey: ["Comments", postId],
    queryFn: ({ pageParam }) =>
      commentServices.getComments({
        postId: postId as string,
        pageParam,
        limit: 3,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ?? undefined;
    },
    enabled: !!postId,
  });
};
