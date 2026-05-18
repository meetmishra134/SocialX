import { postServices } from "@/services/post.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import type { PaginatedPosts, Post } from "@/types/post.types";
import {
  FEED_KEYS,
  findPostInFeeds,
  updateFeedCache,
} from "@/lib/updateFeedCache";

export const useLike = (currentUserId: string) => {
  const queryClient = useQueryClient();

  const { mutate: toggleLike, isPending } = useMutation({
    mutationFn: (postId: string) => postServices.toggleLike(postId),

    onMutate: async (postId: string) => {
      // existing feed cancels
      await Promise.all([
        ...FEED_KEYS.map((key) =>
          queryClient.cancelQueries({ queryKey: [key] }),
        ),
        queryClient.cancelQueries({ queryKey: ["SinglePost", postId] }),
        queryClient.cancelQueries({ queryKey: ["community-posts"] }),
        queryClient.cancelQueries({ queryKey: ["userPosts"] }),
      ]);

      // existing feed snapshots
      const previousFeeds = Object.fromEntries(
        FEED_KEYS.map((key) => [
          key,
          queryClient.getQueryData<InfiniteData<PaginatedPosts>>([key]),
        ]),
      );
      const previousSingle = queryClient.getQueryData<Post>([
        "SinglePost",
        postId,
      ]);

      // snapshot all community post caches
      const communityQueries = queryClient.getQueriesData<
        InfiniteData<PaginatedPosts>
      >({
        queryKey: ["community-posts"],
      });
      const profileQueries = queryClient.getQueriesData<
        InfiniteData<PaginatedPosts>
      >({ queryKey: ["userPosts"] });
      const currentPost =
        findPostInFeeds(queryClient, postId) ?? previousSingle;
      const liked = currentPost?.likes?.includes(currentUserId) ?? false;
      const applyToggle = (likes: string[]) =>
        liked
          ? likes.filter((id) => id !== currentUserId)
          : [...likes, currentUserId];

      // existing feed updates
      FEED_KEYS.forEach((key) => {
        queryClient.setQueryData<InfiniteData<PaginatedPosts>>(
          [key],
          (old) =>
            updateFeedCache(
              old,
              postId,
              applyToggle,
            ) as InfiniteData<PaginatedPosts>,
        );
      });

      // update all community post caches ← add this
      communityQueries.forEach(([queryKey]) => {
        queryClient.setQueryData<InfiniteData<PaginatedPosts>>(
          queryKey,
          (old) =>
            updateFeedCache(
              old,
              postId,
              applyToggle,
            ) as InfiniteData<PaginatedPosts>,
        );
      });
      profileQueries.forEach(([queryKey]) => {
        queryClient.setQueryData<InfiniteData<PaginatedPosts>>(
          queryKey,
          (old) =>
            updateFeedCache(
              old,
              postId,
              applyToggle,
            ) as InfiniteData<PaginatedPosts>,
        );
      });

      queryClient.setQueryData<Post>(["SinglePost", postId], (old) =>
        old ? { ...old, likes: applyToggle(old.likes ?? []) } : old,
      );

      return {
        previousFeeds,
        previousSingle,
        communityQueries,
        profileQueries,
      };
    },

    onError: (_err, postId, context) => {
      // existing rollback
      FEED_KEYS.forEach((key) => {
        if (context?.previousFeeds[key]) {
          queryClient.setQueryData([key], context.previousFeeds[key]);
        }
      });

      // rollback community caches ← add this
      context?.communityQueries?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      context?.profileQueries?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      if (context?.previousSingle) {
        queryClient.setQueryData(
          ["SinglePost", postId],
          context.previousSingle,
        );
      }
    },

    onSettled: (_data, _err, postId) => {
      FEED_KEYS.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
      queryClient.invalidateQueries({ queryKey: ["SinglePost", postId] });
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });

  const { mutate: toogleCommentLike, isPending: isCommentLikePending } =
    useMutation({
      mutationFn: (commentId: string) =>
        postServices.toggleCommentLike(commentId),
    });

  return { toggleLike, isPending, toogleCommentLike, isCommentLikePending };
};
