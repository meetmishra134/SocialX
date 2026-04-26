import { socket } from "@/lib/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

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
          (oldData: any) => {
            if (!oldData?.pages) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => {
                if (Array.isArray(page)) {
                  return page.map((comment: any) =>
                    comment._id === commentId ? { ...comment, likes } : comment,
                  );
                }

                const commentArray = page.comments || page.data || page.docs;

                if (Array.isArray(commentArray)) {
                  return {
                    ...page,
                    [page.comments ? "comments" : page.data ? "data" : "docs"]:
                      commentArray.map((comment: any) =>
                        comment._id === commentId
                          ? { ...comment, likes }
                          : comment,
                      ),
                  };
                }

                return page;
              }),
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
