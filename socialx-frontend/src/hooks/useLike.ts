import { postServices } from "@/services/post.services";
import { useMutation } from "@tanstack/react-query";

export const useLike = () => {
  return useMutation({
    mutationFn: (postId: string) => postServices.toggleLike(postId),
  });
};
