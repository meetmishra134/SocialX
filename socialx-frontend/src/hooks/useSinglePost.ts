import { postServices } from "@/services/post.services";
import { useQuery } from "@tanstack/react-query";

export const useSinglePost = (postId: string | undefined) => {
  return useQuery({
    queryKey: ["SinglePost", postId],
    queryFn: () => postServices.getSinglePost(postId as string),
    enabled: !!postId,
    staleTime: 5 * 60 * 1000,
  });
};
