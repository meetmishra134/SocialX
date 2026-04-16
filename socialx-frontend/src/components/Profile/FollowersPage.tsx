import type { UserCardType } from "@/types/user.types";
import UserCard from "../connect/UserCard";
import { useFollowers } from "@/hooks/useConnections";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import FollowButton from "../connect/FollowButton";

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

const FollowersPage = () => {
  const { userName } = useParams();
  const { data: users, isLoading } = useFollowers(userName as string);

  if (isLoading)
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  if (users?.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-muted-foreground capitalize">
          {userName} has no followers yet
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
