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
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import type { UserProfile } from "@/types/user.types";
import ProfileSettings from "./ProfileSettings";
import SkeletonCard from "../posts/SkeletonCard";

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
    queryClient.setQueryData(["profile", userId], (oldData: UserProfile) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        followersCount: isNowFollowing
          ? oldData.followersCount + 1
          : oldData.followersCount - 1,
      };
    });
  };

  useDocumentTitle(
    profile ? `${profile.fullName} (@${profile.userName})` : "Loading...",
  );

  return (
    <div>
      <div className="bg-background/80 sticky top-0 z-50 flex items-center gap-3 border-b px-3 py-2 backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          className="hover:bg-muted rounded-full p-2 transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="flex flex-col gap-1 leading-tight">
          {isFetching ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            <h1 className="text-lg font-semibold">{profile?.fullName}</h1>
          )}

          {/* Post count in header */}
          {isFetching || isLoading ? (
            <Skeleton className="h-3 w-12" />
          ) : (
            <span className="text-muted-foreground text-xs">
              {posts?.length || 0} posts
            </span>
          )}
        </div>
      </div>

      <div className="relative h-44 w-full bg-linear-to-b from-neutral-700 to-neutral-800">
        {isFetching ? (
          <Skeleton className="absolute -bottom-12 left-4 h-24 w-24 rounded-full border-4" />
        ) : (
          <Avatar className="border-background absolute -bottom-12 left-4 h-24 w-24 border-4 shadow-md">
            <AvatarImage src={profile?.avatarUrl} />
            <AvatarFallback>{profile?.fullName?.[0]}</AvatarFallback>
          </Avatar>
        )}
      </div>

      <div className="relative border-b border-neutral-700 px-4 pt-14 pb-2">
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-lg font-bold">
              {isFetching ? (
                <Skeleton className="h-4 w-36" />
              ) : (
                profile?.fullName
              )}
            </h2>

            {!isFetching && (
              <>
                {profile?.isEmailVerified ? (
                  <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-500">
                    <CheckCircle2 className="h-5 w-5 fill-blue-500/10 text-blue-500" />
                    Verified
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
              </>
            )}
          </div>

          {isFetching ? (
            <Skeleton className="mt-2 h-3 w-24" />
          ) : (
            <p className="text-muted-foreground text-sm">
              @{profile?.userName}
            </p>
          )}

          {isFetching ? (
            <div className="mt-2 flex flex-col gap-1.5">
              <Skeleton className="h-3 w-28" />
            </div>
          ) : (
            <p className="mt-2 text-[0.9rem] leading-relaxed">{profile?.bio}</p>
          )}
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-2">
          {isFetching ? (
            <Skeleton className="h-8 w-20 rounded-full" />
          ) : profile?.isOwnProfile ? (
            <>
              <Button
                size="sm"
                className="rounded-full px-4"
                onClick={() => setOpen(!open)}
              >
                Edit
              </Button>
              <ProfileSettings />
            </>
          ) : (
            <FollowButton
              className="rounded-full px-4"
              userId={profile?._id}
              initialIsFollowing={profile?.isFollowing}
              followsMe={profile?.followsMe}
              onSuccess={handleOptimisticStats}
              isLoading={isFetching}
            />
          )}
        </div>

        <div className="mt-2.5 flex gap-5 text-sm">
          {isFetching ? (
            <>
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20" />
            </>
          ) : (
            <>
              <Link to={`/profile/${userId}/followers`}>
                <span className="font-semibold">{profile?.followersCount}</span>
                <span className="text-muted-foreground ml-1">Followers</span>
              </Link>
              <Link to={`/profile/${userId}/following`}>
                <span className="font-semibold">{profile?.followingCount}</span>
                <span className="text-muted-foreground ml-1">Following</span>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-y-4">
        {isLoading ? (
          <div className="flex flex-col space-y-4 px-3 py-4">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : isError ? (
          <p className="text-muted-foreground p-4 text-center">
            Error loading posts.
          </p>
        ) : posts?.length === 0 ? (
          <p className="text-muted-foreground p-4 text-center">
            No posts available
          </p>
        ) : (
          posts?.map((post: Post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default ProfileLayout;
