import { useState } from "react";
import { Button } from "../ui/button";
import { userService } from "@/services/user.services";
import { toast } from "sonner";

interface FollowButtonProps {
  userId: string;
  initialIsFollowing: boolean | undefined;
  onSuccess: (userId: string) => void;
}
const FollowButton = ({
  userId,
  initialIsFollowing,
  onSuccess,
}: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const handleFollowToggle = async () => {
    const previousState = isFollowing;
    setIsFollowing(!isFollowing);
    try {
      const data = await userService.followUser(userId);
      toast.success(data.message || "You are now following this user");
      if (onSuccess) onSuccess(userId);
    } catch (error) {
      setIsFollowing(previousState);
      console.error(error);
      toast.error("Failed to follow user");
    }
  };
  return (
    <Button
      className="cursor-pointer"
      onClick={handleFollowToggle}
      variant={isFollowing ? "secondary" : "default"}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
};

export default FollowButton;
