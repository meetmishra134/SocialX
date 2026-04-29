import type { UserCardType } from "@/types/user.types";
import UserCard from "./UserCard";
import { useDiscovery } from "@/hooks/useDiscovery";
import { Loader } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import FollowButton from "./FollowButton";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const Connect = () => {
  const { data: users, isLoading } = useDiscovery();
  const queryClient = useQueryClient();
  useDocumentTitle("Connect");
  const handleFollowSuccess = (userId: string) => {
    setTimeout(() => {
      queryClient.setQueryData(["discover-users"], (oldUsers: UserCardType[]) => {
        if (!oldUsers) return [];
        return oldUsers.filter((user) => user._id !== userId);
      });
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-3 md:p-2">
      <div className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-10 mb-2 border-b p-1.5 backdrop-blur md:p-2.5">
        <h2 className="text-xl font-bold">Connect </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Connect learn and grow together 
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          <div className="text-muted-foreground flex min-h-[70vh] items-center justify-center">
            <Loader className="mx-auto animate-spin" />
          </div>
        ) : null}
        {users?.length === 0 ? (
          <div className="text-muted-foreground flex min-h-[70vh] items-center justify-center text-center">
            No new developers to discover right now.
          </div>
        ) : (
          users?.map((user: UserCardType) => (
            <UserCard
              user={user}
              key={user._id}
              action={
                <FollowButton
                  userId={user._id}
                  initialIsFollowing={user.isFollowing}
                  onSuccess={handleFollowSuccess}
                  followsMe={user.followsMe}
                />
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Connect;
