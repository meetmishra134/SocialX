import type { PaginatedPosts, Post } from "@/types/post.types";
import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

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
  // static feed keys only
  for (const key of FEED_KEYS) {
    const data = queryClient.getQueryData<InfiniteData<PaginatedPosts>>([key]);
    if (data) {
      for (const page of data.pages) {
        const posts = Array.isArray(page) ? page : page.posts;
        const post = posts?.find((p) => p._id === postId);
        if (post) return post;
      }
    }
  }

  // dynamic community post caches
  const communityQueries = queryClient.getQueriesData<
    InfiniteData<PaginatedPosts>
  >({
    queryKey: ["community-posts"],
  });
  for (const [, data] of communityQueries) {
    if (data) {
      for (const page of data.pages) {
        const posts = Array.isArray(page) ? page : page.posts;
        const post = posts?.find((p) => p._id === postId);
        if (post) return post;
      }
    }
  }

  // dynamic profile caches
  const profileQueries = queryClient.getQueriesData<
    InfiniteData<PaginatedPosts>
  >({
    queryKey: ["userPosts"],
  });
  for (const [, data] of profileQueries) {
    if (data) {
      for (const page of data.pages) {
        const posts = Array.isArray(page) ? page : page.posts;
        const post = posts?.find((p) => p._id === postId);
        if (post) return post;
      }
    }
  }

  return undefined;
};
