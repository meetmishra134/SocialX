import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { socket } from "@/lib/socket";
import type { PaginatedComments } from "@/types/post.types";

interface CommentLikePayload {
  postId: string;
  commentId: string;
  likes: string[];
}

export const useCommentLikeSync = (currentPostId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleCommentLike = ({
      postId,
      commentId,
      likes,
    }: CommentLikePayload) => {
      if (postId === currentPostId) {
        queryClient.setQueryData(
          ["Comments", currentPostId],
          (oldData: InfiniteData<PaginatedComments> | undefined) => {
            if (!oldData?.pages) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                comments: page.comments.map((comment) =>
                  comment._id === commentId ? { ...comment, likes } : comment,
                ),
              })),
            };
          },
        );
      }
    };

    socket.on("comment_like_updated", handleCommentLike);

    return () => {
      socket.off("comment_like_updated", handleCommentLike);
    };
  }, [queryClient, currentPostId]);
};
