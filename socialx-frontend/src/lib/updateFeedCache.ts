import type { PaginatedPosts, Post } from "@/types/post.types";
import type { InfiniteData, useQueryClient } from "@tanstack/react-query";

export const updateFeedCache = (
  oldData: InfiniteData<PaginatedPosts> | undefined,
  postId: string,
  updater: (likes: string[]) => string[],
) => {
  if (!oldData?.pages) return oldData;
  return {
    ...oldData,
    pageParams: oldData.pageParams,
    pages: oldData.pages.map((page: PaginatedPosts) => {
      if (Array.isArray(page)) {
        return (page as Post[]).map((post) =>
          post._id === postId
            ? { ...post, likes: updater(post.likes ?? []) }
            : post,
        );
      }
      if (Array.isArray((page as PaginatedPosts)?.posts)) {
        return {
          ...page,
          posts: (page as PaginatedPosts).posts.map((post: Post) =>
            post._id === postId
              ? { ...post, likes: updater(post.likes ?? []) }
              : post,
          ),
        };
      }
      return page;
    }),
  };
};

export const FEED_KEYS = ["GlobalFeed", "FollowingFeed"] as const;

export const findPostInFeeds = (
  queryClient: ReturnType<typeof useQueryClient>,
  postId: string,
): Post | undefined => {
  for (const key of FEED_KEYS) {
    const feedData = queryClient.getQueryData<InfiniteData<PaginatedPosts>>([
      key,
    ]);
    for (const page of feedData?.pages ?? []) {
      const posts = Array.isArray(page)
        ? page
        : ((page as PaginatedPosts)?.posts ?? []);
      const found = (posts as Post[]).find((p) => p._id === postId);
      if (found) return found;
    }
  }
  return undefined;
};
