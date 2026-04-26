import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProfileData } from "@/hooks/useProfileData";
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useGetUserPosts } from "@/hooks/getUserPosts";
import PostCard from "../posts/PostCard";
import type { Post } from "@/types/post.types";
import FollowButton from "../connect/FollowButton";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/store/authStore";
import { Skeleton } from "../ui/skeleton";

//     _id: "post1",
//     author: {
//       _idid: "69cf68ae4d16faf04cd3b5c2",
//       fullName: "John Doe",
//       userName: "JohnDoe123",
//       avatarUrl: "https://example.com/avatar.jpg",
//     },
//     text: "This is a sample post.",
//     createdAt: "2023-01-01T00:00:00Z",
//     images: [
//       "https://images.pexels.com/photos/34302384/pexels-photo-34302384.jpeg",
//     ],
//     likes: [],
//   },
//   {
//     _id: "post2",
//     author: {
//       id: "user2",
//       fullName: "Jane Smith",
//       userName: "JaneSmith123",
//       avatarUrl: "https://example.com/avatar2.jpg",
//     },
//     text: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//     createdAt: "2023-01-01T00:00:00Z",
//     images: [],
//     likes: [],
//   },
//   {
//     _id: "post3",
//     author: {
//       id: "user3",
//       fullName: "Bob Johnson",
//       userName: "BobJohnson123",
//       avatarUrl: "https://example.com/avatar3.jpg",
//     },
//     images: [
//       "https://images.pexels.com/photos/5596132/pexels-photo-5596132.jpeg",
//       "https://images.pexels.com/photos/34302384/pexels-photo-34302384.jpeg",
//     ],
//     createdAt: "2023-01-01T00:00:00Z",
//     likes: [],
//   },
// ];
interface ProfileLayoutProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileLayout = ({ open, setOpen }: ProfileLayoutProps) => {
  const openVerifyPopup = useAuth((state) => state.openVerifyPopup);
  const { userId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profile, isFetching } = useProfileData(userId as string);
  const { data: posts, isError, isLoading } = useGetUserPosts(userId as string);
  const handleOptimisticStats = (userId: string, isNowFollowing: boolean) => {
    queryClient.setQueryData(["profile", userId], (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        follwersCount: isNowFollowing
          ? oldData.followersCount + 1
          : oldData.followersCount - 1,
      };
    });
  };
  return (
    <div>
      <div className="bg-background/80 sticky top-0 z-50 flex items-center gap-2 border-b p-2 backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          className="hover:bg-muted cursor-pointer rounded-full p-2 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex flex-col">
          <h1 className="flex items-center gap-1 text-xl font-bold">
            {profile?.fullName}
          </h1>
          <span className="text-muted-foreground text-sm">
            {posts?.length || 0} posts
          </span>
        </div>
      </div>
      <div className="bg-muted/70 relative h-50 w-full">
        {isFetching ? (
          <Skeleton className="border-muted/40 absolute -bottom-12 left-2 h-25 w-25 rounded-full border-2" />
        ) : (
          <Avatar className="border-muted/40 ring-ring absolute -bottom-12 left-2 z-10 h-25 w-25 border-2 ring-2">
            <AvatarImage
              src={profile?.avatarUrl}
              alt="Profile Picture"
              referrerPolicy="no-referrer"
            />
            <AvatarFallback>
              {profile?.fullName
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
      <div className="relative border-b border-neutral-700 px-4 pt-14 pb-2">
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-lg font-bold">
              {isFetching ? (
                <Skeleton className="h-3 w-35" />
              ) : (
                profile?.fullName
              )}
            </h2>

            {profile?.isEmailVerified ? (
              <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-500">
                <CheckCircle2 className="h-5 w-5 fill-blue-500/10 text-blue-500" />
                Email Verified
              </span>
            ) : profile?.isOwnProfile ? (
              <button
                className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] font-medium text-yellow-600 transition-colors hover:bg-yellow-500/20 dark:text-yellow-400"
                onClick={() => openVerifyPopup()}
              >
                <AlertCircle className="h-3 w-3" />
                Verify Email
              </button>
            ) : null}
          </div>

          {isFetching ? (
            <Skeleton className="mt-2 h-3 w-25" />
          ) : (
            <p className="text-muted-foreground text-sm">
              @{profile?.userName}
            </p>
          )}
          <p className="mt-2 text-[0.9rem] leading-relaxed"></p>
        </div>
        <div className="absolute top-0 right-2">
          {profile?.isOwnProfile ? (
            <Button
              className="mt-4 ml-auto cursor-pointer rounded-full"
              onClick={() => setOpen(!open)}
            >
              Edit Profile
            </Button>
          ) : (
            <FollowButton
              className="mt-4 rounded-full"
              userId={profile?._id}
              initialIsFollowing={profile?.isFollowing}
              followsMe={profile?.followsMe}
              onSuccess={handleOptimisticStats}
            />
          )}
        </div>
        <div className="mt-2 flex gap-4 text-[0.95rem]">
          <div>
            <Link
              to={`/profile/${userId}/followers`}
              className="text-foreground/90 hover:text-foreground hover:decoration-accent-foreground hover:underline"
            >
              <span>{profile?.followersCount}</span>
              <span className="text-muted-foreground ml-1">Followers</span>
            </Link>
          </div>
          <div>
            <Link
              to={`/profile/${userId}/following`}
              className="text-foreground/90 hover:text-foreground hover:decoration-accent-foreground hover:underline"
            >
              <span>{profile?.followingCount}</span>
              <span className="text-muted-foreground ml-1">Following</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {posts?.length === 0 && (
          <p className="text-muted-foreground p-4 text-center">
            No posts available{" "}
          </p>
        )}
        {isLoading ? (
          <p className="text-muted-foreground p-4 text-center">
            Loading posts...
          </p>
        ) : isError ? (
          <p className="text-muted-foreground p-4 text-center">
            Error loading posts.
          </p>
        ) : (
          posts?.map((post: Post) => (
            <div className="border-border border-b" key={post._id}>
              <PostCard post={post} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfileLayout;
