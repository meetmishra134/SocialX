import { api } from "@/lib/axios";

export const communityServices = {
  createCommunity: async (formData: FormData) => {
    const res = await api.post("/communities", formData);
    return res.data;
  },
  discoverCommunities: async ({
    pageParam = 1,
    limit = 10,
  }: {
    pageParam: number;
    limit: number;
  }) => {
    const res = await api.get(`/communities?page=${pageParam}&limit=${limit}`);
    return res.data.data;
  },
  getJoinedCommunities: async ({
    pageParam = 1,
    limit = 10,
  }: {
    pageParam: number;
    limit: number;
  }) => {
    const res = await api.get(
      `/communities/joined?page=${pageParam}&limit=${limit}`,
    );
    return res.data.data;
  },
  getCommunity: async (communityId: string) => {
    const res = await api.get(`/communities/${communityId}`);
    return res.data.data.community;
  },
  joinCommunity: async (communityId: string) => {
    const res = await api.post(`/communities/${communityId}/join`);
    return res.data;
  },
  leaveCommunity: async (communityId: string) => {
    const res = await api.post(`/communities/${communityId}/leave`);
    return res.data;
  },
  createCommunityPosts: async (communityId: string, formData: FormData) => {
    const res = await api.post(`/communities/${communityId}/posts`, formData);
    return res.data;
  },
  getCommunityPosts: async ({
    communityId,
    pageParam = 1,
    limit = 10,
  }: {
    communityId: string;
    pageParam: number;
    limit: number;
  }) => {
    const res = await api.get(
      `/communities/${communityId}/posts?page=${pageParam}&limit=${limit}`,
    );
    return res.data.data;
  },
  deleteCommunity: async (communityId: string) => {
    const res = await api.delete(`/communities/${communityId}`);
    return res.data;
  },
  deleteCommunityPost: async (communityId: string, postId: string) => {
    const res = await api.delete(`/communities/${communityId}/posts/${postId}`);
    return res.data;
  },
  getAllMembers: async ({
    communityId,
    pageParam = 1,
    limit = 10,
  }: {
    communityId: string;
    pageParam?: number;
    limit?: number;
  }) => {
    const res = await api.get(
      `/communities/${communityId}/members?page=${pageParam}&limit=${limit}`,
    );
    return res.data.data;
  },
  deleteCommunityMembers: async (communityId: string, userId: string) => {
    const res = await api.delete(
      `/communities/${communityId}/members/${userId}`,
    );
    return res.data;
  },
  getCommunityNotifications: async ({
    communityId,
    pageParam = 1,
    limit = 10,
  }: {
    communityId: string;
    pageParam: number;
    limit: number;
  }) => {
    const res = await api.get(
      `/communities/${communityId}/notifications?page=${pageParam}&limit=${limit}`,
    );
    return res.data.data;
  },
  markAllCommunityNotificationAsRead: async (communityId: string) => {
    const res = await api.post(
      `/communities/${communityId}/mark-notifications-read`,
    );
    return res.data.data;
  },
};
