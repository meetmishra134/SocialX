import { communityServices } from "@/services/community.services";
import { useAuth } from "@/store/authStore";
import type {
  Community,
  InfiniteCommunities,
  Members,
} from "@/types/community.types";
import type { PaginatedNotifications } from "@/types/notification.types";
import type { PaginatedPosts, Post } from "@/types/post.types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useDiscoverCommunities = () => {
  return useInfiniteQuery({
    queryKey: ["discover-communities"],
    queryFn: ({ pageParam }) =>
      communityServices.discoverCommunities({ pageParam, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ?? undefined;
    },
  });
};
export const useCreateCommunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: communityServices.createCommunity,
    onSuccess: (data) => {
      const successMessage = data?.message || "Community created successfully";
      toast.success(successMessage, { position: "top-center" });
      queryClient.invalidateQueries({ queryKey: ["discover-communities"] });
      queryClient.invalidateQueries({ queryKey: ["joined-communities"] });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
        message?: string;
      };

      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "An error occurred while adding the comment.";
      toast.error(errorMessage, {
        position: "top-center",
      });
    },
  });
};
export const useGetJoinedCommunities = () => {
  return useInfiniteQuery({
    queryKey: ["joined-communities"],
    queryFn: ({ pageParam }) =>
      communityServices.getJoinedCommunities({ pageParam, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ?? undefined;
    },
  });
};
export const useGetCommunity = (communityId: string) => {
  return useQuery({
    queryKey: ["community", communityId],
    queryFn: () => communityServices.getCommunity(communityId),
  });
};
export const useJoinCommunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (communityId: string) =>
      communityServices.joinCommunity(communityId),
    onMutate: async (communityId) => {
      await queryClient.cancelQueries({ queryKey: ["discover-communities"] });
      const previousData = queryClient.getQueryData(["discover-communities"]);
      await new Promise((resolve) => setTimeout(resolve, 600));
      queryClient.setQueryData(
        ["discover-communities"],
        (old: InfiniteData<InfiniteCommunities> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: InfiniteCommunities) => ({
              ...page,
              communities: page.communities.filter(
                (c: Community) => c._id !== communityId,
              ),
            })),
          };
        },
      );

      return { previousData };
    },

    onError: (error: unknown, _communityId, context) => {
      queryClient.setQueryData(["discover-communities"], context?.previousData);
      const err = error as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "An error occurred while joining the community.";
      toast.error(errorMessage, {
        position: "top-center",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["discover-communities"] });
      queryClient.invalidateQueries({ queryKey: ["joined-communities"] });
      queryClient.invalidateQueries({ queryKey: ["community"] });
    },
  });
};
export const useLeaveCommunity = () => {
  const queryClient = useQueryClient();
  const user = useAuth((state) => state.user);

  return useMutation({
    mutationFn: (communityId: string) =>
      communityServices.leaveCommunity(communityId),

    onMutate: async (communityId) => {
      await queryClient.cancelQueries({ queryKey: ["community", communityId] });
      await queryClient.cancelQueries({ queryKey: ["joined-communities"] });
      await queryClient.cancelQueries({ queryKey: ["discover-communities"] });

      const previousCommunity = queryClient.getQueryData([
        "community",
        communityId,
      ]);
      const previousJoined = queryClient.getQueryData(["joined-communities"]);
      const previousDiscover = queryClient.getQueryData([
        "discover-communities",
      ]);

      queryClient.setQueryData(
        ["community", communityId],
        (old: Community | undefined) => {
          if (!old) return old;
          return {
            ...old,
            membersCount: old.membersCount - 1,

            members: old.members.filter((m: Members) => m._id !== user?._id),
          };
        },
      );

      // optimistically remove from joined list
      queryClient.setQueryData(
        ["joined-communities"],
        (old: InfiniteData<InfiniteCommunities> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: InfiniteCommunities) => ({
              ...page,
              communities: page.communities.filter(
                (c: Community) => c._id !== communityId,
              ),
            })),
          };
        },
      );

      return { previousCommunity, previousJoined, previousDiscover };
    },

    onSuccess: (data) => {
      toast.success(data?.message || "Left community successfully", {
        position: "top-center",
      });
    },

    onError: (error: unknown, communityId, context) => {
      // rollback all
      queryClient.setQueryData(
        ["community", communityId],
        context?.previousCommunity,
      );
      queryClient.setQueryData(["joined-communities"], context?.previousJoined);
      queryClient.setQueryData(
        ["discover-communities"],
        context?.previousDiscover,
      );

      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "An error occurred while leaving the community.",
        { position: "top-center" },
      );
    },

    onSettled: (_data, _err, communityId) => {
      queryClient.invalidateQueries({ queryKey: ["community", communityId] });
      queryClient.invalidateQueries({ queryKey: ["joined-communities"] });
      queryClient.invalidateQueries({ queryKey: ["discover-communities"] });
    },
  });
};
export const useDeleteCommunity = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (communityId: string) =>
      communityServices.deleteCommunity(communityId),
    onSuccess: (data) => {
      const successMessage = data?.message || "Community deleted successfully";
      toast.success(successMessage, { position: "top-center" });
      queryClient.invalidateQueries({ queryKey: ["joined-communities"] });
      navigate("/myCommunities");
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "An error occurred while deleting the community.";
      toast.error(errorMessage, {
        position: "top-center",
      });
    },
  });
};
export const useGetCommunityPosts = (communityId: string) => {
  return useInfiniteQuery({
    queryKey: ["community-posts", communityId],
    queryFn: ({ pageParam }) =>
      communityServices.getCommunityPosts({
        communityId,
        pageParam,
        limit: 10,
      }),
    initialPageParam: 1,
    enabled: !!communityId,
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ?? undefined;
    },
  });
};
export const useCreateCommunityPost = (communityId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      communityServices.createCommunityPosts(communityId, formData),
    onSuccess: (data) => {
      const successMessage = data?.message || "Post created successfully";
      toast.success(successMessage, { position: "top-center" });
      queryClient.invalidateQueries({
        queryKey: ["community-posts", communityId],
      });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "An error occurred while creating the post.";
      toast.error(errorMessage, {
        position: "top-center",
      });
    },
  });
};
export const useDeleteCommunityPost = (communityId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) =>
      communityServices.deleteCommunityPost(communityId, postId),

    onMutate: async (postId) => {
      await queryClient.cancelQueries({
        queryKey: ["community-posts", communityId],
      });
      await queryClient.cancelQueries({
        queryKey: ["community", communityId],
      });

      const previousPosts = queryClient.getQueryData([
        "community-posts",
        communityId,
      ]);
      const previousCommunity = queryClient.getQueryData([
        "community",
        communityId,
      ]);

      // optimistically remove post from list
      queryClient.setQueryData(
        ["community-posts", communityId],
        (old: InfiniteData<PaginatedPosts>) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: PaginatedPosts) => ({
              ...page,
              posts: page.posts.filter((p: Post) => p._id !== postId),
            })),
          };
        },
      );

      // optimistically decrement postsCount
      queryClient.setQueryData(["community", communityId], (old: Community) => {
        if (!old) return old;
        return {
          ...old,
          postsCount: Math.max(0, old.postsCount - 1), // never go below 0
        };
      });

      return { previousPosts, previousCommunity };
    },

    onSuccess: (data) => {
      toast.success(data?.message || "Post deleted successfully", {
        position: "top-center",
      });
    },

    onError: (error: unknown, _postId, context) => {
      // rollback both
      queryClient.setQueryData(
        ["community-posts", communityId],
        context?.previousPosts,
      );
      queryClient.setQueryData(
        ["community", communityId],
        context?.previousCommunity,
      );

      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "An error occurred while deleting the post.",
        { position: "top-center" },
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["community-posts", communityId],
      });
      queryClient.invalidateQueries({
        queryKey: ["community", communityId],
      });
      queryClient.invalidateQueries({
        queryKey: ["community-notifications", communityId],
      });
    },
  });
};
export const useGetAllMembers = (communityId: string) => {
  return useInfiniteQuery({
    queryKey: ["community-members", communityId],
    queryFn: ({ pageParam }) =>
      communityServices.getAllMembers({ communityId, pageParam, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ?? undefined;
    },
  });
};
export const useDeleteCommunityMember = (communityId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      communityId,
      userId,
    }: {
      communityId: string;
      userId: string;
    }) => communityServices.deleteCommunityMembers(communityId, userId),
    onSuccess: (data) => {
      const successMessage = data?.message || "Member removed successfully";
      toast.success(successMessage, { position: "top-center" });
      queryClient.invalidateQueries({
        queryKey: ["community-members", communityId],
      });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "An error occurred while removing the member.";
      toast.error(errorMessage, {
        position: "top-center",
      });
    },
  });
};
export const useGetCommunityNotifications = (communityId: string) => {
  return useInfiniteQuery({
    queryKey: ["community-notifications", communityId],
    queryFn: ({ pageParam }) =>
      communityServices.getCommunityNotifications({
        communityId,
        pageParam,
        limit: 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ?? undefined;
    },
  });
};
export const useMarkCommunityNotificationsAsRead = (communityId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      communityServices.markAllCommunityNotificationAsRead(communityId),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["community-notifications", communityId],
      });

      const previous = queryClient.getQueryData([
        "community-notifications",
        communityId,
      ]);

      // optimistically mark all as read
      queryClient.setQueryData(
        ["community-notifications", communityId],
        (old: InfiniteData<PaginatedNotifications>) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: PaginatedNotifications) => ({
              ...page,
              notifications: page.notifications.map((n) => ({
                ...n,
                isRead: true,
              })),
            })),
          };
        },
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(
        ["community-notifications", communityId],
        context?.previous,
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["community-notifications", communityId],
      });
    },
  });
};
