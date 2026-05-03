import { postServices } from "@/services/post.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import type { PaginatedComments, Comments } from "@/types/post.types";

const updateCommentCache = (
  oldData: InfiniteData<PaginatedComments> | undefined,
  commentId: string,
  updater: (likes: string[]) => string[],
) => {
  if (!oldData?.pages) return oldData;
  return {
    ...oldData,
    pageParams: oldData.pageParams,
    pages: oldData.pages.map((page) => ({
      ...page,
      comments: page.comments.map((comment: Comments) =>
        comment._id === commentId
          ? { ...comment, likes: updater(comment.likes ?? []) }
          : comment,
      ),
    })),
  };
};

const findCommentInCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  postId: string,
  commentId: string,
): Comments | undefined => {
  const data = queryClient.getQueryData<InfiniteData<PaginatedComments>>([
    "Comments",
    postId,
  ]);
  for (const page of data?.pages ?? []) {
    const found = page.comments.find((c: Comments) => c._id === commentId);
    if (found) return found;
  }
  return undefined;
};

export const useCommentLike = (currentUserId: string) => {
  const queryClient = useQueryClient();

  const { mutate: toggleCommentLike, isPending } = useMutation({
    mutationFn: ({ commentId }: { commentId: string; postId: string }) =>
      postServices.toggleCommentLike(commentId),

    onMutate: async ({ commentId, postId }) => {
      await queryClient.cancelQueries({ queryKey: ["Comments", postId] });

      const previousComments = queryClient.getQueryData<
        InfiniteData<PaginatedComments>
      >(["Comments", postId]);

      const currentComment = findCommentInCache(queryClient, postId, commentId);
      const liked = currentComment?.likes?.includes(currentUserId) ?? false;

      const applyToggle = (likes: string[]) =>
        liked
          ? likes.filter((id) => id !== currentUserId)
          : [...likes, currentUserId];

      queryClient.setQueryData<InfiniteData<PaginatedComments>>(
        ["Comments", postId],
        (old) =>
          updateCommentCache(
            old,
            commentId,
            applyToggle,
          ) as InfiniteData<PaginatedComments>,
      );

      return { previousComments };
    },

    onError: (_err, { postId }, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["Comments", postId],
          context.previousComments,
        );
      }
    },

    onSettled: (_data, _err, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["Comments", postId] });
    },
  });

  return { toggleCommentLike, isPending };
};
