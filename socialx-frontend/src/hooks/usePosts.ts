import { postServices } from "@/services/post.services";
import { useAuth } from "@/store/authStore";
import type { Post } from "@/types/post.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const usePosts = () => {
  const queryClient = useQueryClient();
  const user = useAuth((state) => state.user);
  return useQuery({
    queryKey: ["GlobalFeed"],
    queryFn: async () => {
      const posts = await postServices.getPost();

      posts.forEach((post: Post) => {
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
          user?.bookmarks.includes(post._id) ?? false,
        );
      });

      return posts;
    },
  });
};
