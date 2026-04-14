import { postServices } from "@/services/post.services";
import { useAuth } from "@/store/authStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useSinglePost = (postId: string | undefined) => {
  const queryClient = useQueryClient();
  const user = useAuth((state) => state.user);
  return useQuery({
    queryKey: ["SinglePost", postId],
    enabled: !!postId,
    queryFn: async () => {
      const post = await postServices.getSinglePost(postId as string);

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
      return post;
    },
  });
};
