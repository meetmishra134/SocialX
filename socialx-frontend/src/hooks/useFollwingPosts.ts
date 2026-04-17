import { postServices } from "@/services/post.services";
import { useAuth } from "@/store/authStore";
import type { Post } from "@/types/post.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useFollowingPosts = () => {
  const queryClient = useQueryClient();
  const user = useAuth((state) => state.user);
  return useQuery({
    queryKey: ["FollowingFeed"],
    queryFn: async () => {
      const posts = await postServices.getFollowingPosts();

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
