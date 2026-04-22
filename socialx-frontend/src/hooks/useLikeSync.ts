import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "@/lib/socket";
import type { Post } from "@/types/post.types";

interface LikePayload {
  postId: string;
  likes: string[];
}

const updateFeedCache = (oldData: any, postId: string, likes: string[]) => {
  if (!oldData?.pages) return oldData;
  return {
    ...oldData,
    pages: oldData.pages.map((page: any) => {
      if (Array.isArray(page)) {
        return page.map((post: Post) =>
          post._id === postId ? { ...post, likes } : post,
        );
      }
      if (Array.isArray(page?.posts)) {
        return {
          ...page,
          posts: page.posts.map((post: Post) =>
            post._id === postId ? { ...post, likes } : post,
          ),
        };
      }
      return page;
    }),
  };
};

export const useLikeSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on("like_updated", ({ postId, likes }: LikePayload) => {
      queryClient.setQueryData(["GlobalFeed"], (oldData: any) =>
        updateFeedCache(oldData, postId, likes),
      );

      queryClient.setQueryData(["FollowingFeed"], (oldData: any) =>
        updateFeedCache(oldData, postId, likes),
      );

      queryClient.setQueryData(["SinglePost", postId], (oldPost: any) =>
        oldPost ? { ...oldPost, likes } : oldPost,
      );
    });

    return () => {
      socket.off("like_updated");
    };
  }, [queryClient]);
};
