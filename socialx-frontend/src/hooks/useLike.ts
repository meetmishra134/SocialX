import { postServices } from "@/services/post.services";
import { useMutation } from "@tanstack/react-query";

export const useLike = () => {
  const { mutate: toggleLike, isPending } = useMutation({
    mutationFn: (postId: string) => postServices.toggleLike(postId),
  });

  const { mutate: toogleCommentLike, isPending: isCommentLikePending } =
    useMutation({
      mutationFn: (commentId: string) =>
        postServices.toggleCommentLike(commentId),
    });
  return {
    toggleLike,
    isPending,
    toogleCommentLike,
    isCommentLikePending,
  };
};
