import type { UserCardType } from "@/types/user.types";
import UserCard from "../connect/UserCard";
import { Button } from "../ui/button";

const users: UserCardType[] = [
  {
    _id: "1",
    fullName: "John Doe",
    userName: "johndoe",
    bio: "CEO at XYZ Company. Passionate about technology and innovation.",
    avatarUrl: {
      url: "https://images.pexels.com/photos/36361500/pexels-photo-36361500.jpeg",
    },
    isFollowing: false,
  },
  {
    _id: "2",
    fullName: "Jane Smith",
    userName: "janesmith",
    bio: "Marketing expert with a love for social media and content creation.",
    avatarUrl: {
      url: "https://images.pexels.com/photos/33260938/pexels-photo-33260938.jpeg",
    },
    isFollowing: false,
  },
];

const FollowingPage = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-2 p-4">
      {users.map((user) => (
        <UserCard
          user={user}
          key={user._id}
          action={
            <Button variant="default" size="xs" className="cursor-pointer">
              Following
            </Button>
          }
        />
      ))}
    </div>
  );
};

export default FollowingPage;
