import { useState } from "react";
import { Button } from "../ui/button";
import { userService } from "@/services/user.services";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface FollowButtonProps {
  userId: string;
  initialIsFollowing?: boolean | undefined;
  followsMe?: boolean;
  onSuccess?: (userId: string, isNowFollowing: boolean) => void;
  className?: string;
}
const FollowButton = ({
  userId,
  initialIsFollowing,
  onSuccess,
  followsMe,
  className,
}: FollowButtonProps) => {
  const queryClient = useQueryClient();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isHovered, setIsHovered] = useState(false);
  const handleFollowToggle = async () => {
    const previousState = isFollowing;
    const newState = !isFollowing;
    setIsFollowing(newState);
    try {
      if (newState) {
        await userService.followUser(userId);
        toast.success("You are now following this user", {
          position: "top-center",
        });
      } else {
        await userService.unfollowUser(userId);
        toast.success("You have unfollowed this user", {
          position: "top-center",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["discover-users"] });

      queryClient.setQueriesData({ queryKey: ["profile"] }, (oldData: any) => {
        if (!oldData) return oldData;

        const updatedData = { ...oldData };

        if (updatedData.isOwnProfile) {
          updatedData.followingCount = newState
            ? updatedData.followingCount + 1
            : updatedData.followingCount - 1;
        }

        if (updatedData._id === userId) {
          updatedData.followersCount = newState
            ? updatedData.followersCount + 1
            : updatedData.followersCount - 1;
        }

        return updatedData;
      });
      if (onSuccess) onSuccess(userId, newState);
    } catch (error) {
      setIsFollowing(previousState);
      console.error(error);
      toast.error("Failed to follow user", {
        position: "top-center",
      });
    }
  };
  let buttonText = "Follow";
  let buttonVariant: "default" | "secondary" | "outline" | "destructive" =
    "default";
  if (isFollowing) {
    if (isHovered) {
      buttonText = "Unfollow";
      buttonVariant = "destructive";
    } else {
      buttonText = "Following";
      buttonVariant = "secondary";
    }
  } else if (followsMe) {
    buttonText = "Follow Back";
    buttonVariant = "default";
  }
  return (
    <Button
      className={cn(
        "w-28 cursor-pointer transition-all duration-200 ease-in-out",
        className,
      )}
      onClick={handleFollowToggle}
      variant={buttonVariant}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {buttonText}
    </Button>
  );
};

export default FollowButton;
