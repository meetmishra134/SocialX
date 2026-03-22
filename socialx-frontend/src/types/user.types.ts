export interface User {
  id: string;
  fullName: string;
  userName: string;
  email: string;
  bio?: string;
  followers: string[];
  following: string[];
  isEmailVerified: boolean;
  avatarUrl?: { url: string };
  createdAt: string;
  updatedAt: string;
}
