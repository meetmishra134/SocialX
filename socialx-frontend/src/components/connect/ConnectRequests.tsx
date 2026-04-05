import type { UserCardType } from "@/types/user.types";
import UserCard from "./UserCard";

import { Button } from "../ui/button";

const connectRequests: UserCardType[] = [
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

const ConnectRequests = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-2 px-2 py-3">
      {connectRequests.map((user) => (
        <UserCard
          user={user}
          key={user._id}
          action={
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="cursor-pointer rounded-full px-3 py-2"
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="cursor-pointer rounded-full px-3 py-2"
              >
                Decline
              </Button>
            </div>
          }
        />
      ))}
    </div>
  );
};

export default ConnectRequests;
