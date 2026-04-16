import type { UserCardType } from "@/types/user.types";
import UserCard from "../connect/UserCard";

import { useFollowing } from "@/hooks/useConnections";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import FollowButton from "../connect/FollowButton";
import { useQueryClient } from "@tanstack/react-query";

const FollowingPage = () => {
  const { userName } = useParams();
  const { data: users, isLoading } = useFollowing(userName as string);
  const queryclient = useQueryClient();
  const handleFollow = (userId: string, isNowFollowing: boolean) => {
    if (!isNowFollowing) {
      setTimeout(() => {
        queryclient.setQueryData(["following", userName], (oldData: any) => {
          if (!oldData) return [];
          return oldData.filter((user) => user._id !== userId);
        });
      }, 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }
  if (users?.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-muted-foreground capitalize">
          {userName} is not following anyone yet
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
              onSuccess={handleFollow}
            />
          }
        />
      ))}
    </div>
  );
};

export default FollowingPage;
