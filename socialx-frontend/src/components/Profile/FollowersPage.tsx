import type { UserCardType } from "@/types/user.types";
import UserCard from "../connect/UserCard";
import { useFollowers } from "@/hooks/useConnections";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import FollowButton from "../connect/FollowButton";

const FollowersPage = () => {
  const { userId } = useParams();
  const { data: users, isLoading } = useFollowers(userId as string);

  if (isLoading)
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  if (users?.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-muted-foreground text-center capitalize">
          This user has no followers yet
        </p>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-7xl space-y-2 p-4">
      {users?.map((user: UserCardType) => (
        <UserCard
          user={user}
          key={user._id}
          action={
            <FollowButton
              userId={user._id}
              initialIsFollowing={user.isFollowing}
              followsMe={user.followsMe}
            />
          }
        />
      ))}
    </div>
  );
};

export default FollowersPage;
