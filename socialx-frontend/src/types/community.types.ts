export interface Members {
  _id: string;
  userName: string;
  fullName: string;
  avatarUrl?: { url: string };
}
export interface Community {
  _id: string;
  name: string;
  description: string;
  avatar: {
    url: string;
    publicId: string;
  };
  creator: {
    _id: string;
    userName: string;
    fullName: string;
    avatarUrl?: { url: string };
  };
  members: Members[];
  postsCount: number;
  membersCount: number;
  createdAt: string;
  updatedAt: string;
}
export interface InfiniteCommunities {
  communities: Community[];
  hasMore: boolean;
  nextPage: number | null;
}
