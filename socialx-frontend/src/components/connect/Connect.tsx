import type { UserCardType } from "@/types/user.types";
import UserCard from "./UserCard";
import { useDiscovery } from "@/hooks/useDiscovery";
import { Loader } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import FollowButton from "./FollowButton";

// const users: UserCardType[] = [
//   {
//     _id: "1",
//     fullName: "John Doe",
//     userName: "johndoe",
//     bio: "CEO at XYZ Company. Passionate about technology and innovation.",
//     avatarUrl: {
//       url: "https://images.pexels.com/photos/36361500/pexels-photo-36361500.jpeg",
//     },
//     isFollowing: false,
//   },
//   {
//     _id: "2",
//     fullName: "Jane Smith",
//     userName: "janesmith",
//     bio: "Marketing expert with a love for social media and content creation.",
//     avatarUrl: {
//       url: "https://images.pexels.com/photos/33260938/pexels-photo-33260938.jpeg",
//     },
//     isFollowing: false,
//   },
// ];

const Connect = () => {
  const { data: users, isLoading } = useDiscovery();
  const queryClient = useQueryClient();
  const handleFollowSuccess = (userId: string) => {
    setTimeout(() => {
      // Safely update the React Query cache to remove the specific user
      queryClient.setQueryData(["discover-users"], (oldUsers: any[]) => {
        if (!oldUsers) return [];
        return oldUsers.filter((user) => user._id !== userId);
      });
    }, 1000);
  };
  return (
    <div className="mx-auto max-w-2xl space-y-4 p-3 md:p-4">
      <div className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-10 mb-2 border-b p-1.5 backdrop-blur md:p-4">
        <h2 className="text-lg font-bold">Connect with People</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Connect who you might know.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          <div className="text-muted-foreground py-10 text-center">
            <Loader className="mx-auto animate-spin" />
          </div>
        ) : null}
        {users?.length === 0 ? (
          <div className="text-muted-foreground py-10 text-center">
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
