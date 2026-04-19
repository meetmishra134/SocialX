import { postServices } from "@/services/post.services";
import { useAuth } from "@/store/authStore";
import type { Post } from "@/types/post.types";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

export const usePosts = () => {
  const queryClient = useQueryClient();
  const user = useAuth((state) => state.user);

  return useInfiniteQuery({
    queryKey: ["GlobalFeed"],
    queryFn: async ({ pageParam }) => {
      const response = await postServices.getPost({
        pageParam: pageParam as number,
        limit: 10,
      });

      if (response.posts && Array.isArray(response.posts)) {
        response.posts.forEach((post: Post) => {
          queryClient.setQueryData(
            ["like", post._id],
            post.likes?.includes(user?._id ?? "") ?? false,
          );
          queryClient.setQueryData(
            ["likesCount", post._id],
            post.likes?.length ?? 0,
          );
          queryClient.setQueryData(
            ["bookmark", post._id],
            user?.bookmarks?.includes(post._id) ?? false,
          );
        });
      }

      return response;
    },
    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ?? undefined;
    },
  });
};
