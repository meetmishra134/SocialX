import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { useDiscovery } from "@/hooks/useDiscovery";
import type { UserCardType } from "@/types/user.types";
import FollowButton from "../connect/FollowButton";

const FriendSuggestionWidget = () => {
  const { data: friendsSuggestion, isLoading, isRefetching } = useDiscovery();

  if (isLoading || isRefetching) {
    return (
      <Card className="flex w-76 items-center justify-center p-4 shadow-md">
        <Loader className="text-muted-foreground animate-spin" />
      </Card>
    );
  }

  if (!friendsSuggestion || friendsSuggestion.length === 0) {
    return null;
  }

  return (
    <Card className="border-border w-76 overflow-hidden shadow-md">
      <CardHeader className="bg-muted/30 border-b p-3">
        <CardTitle className="text-muted-foreground text-center text-sm font-bold tracking-wider uppercase">
          Discover new friends
        </CardTitle>
      </CardHeader>

      <CardContent className="p-3">
        <div className="flex flex-col gap-4">
          {friendsSuggestion.slice(0, 3).map((friend: UserCardType) => (
            <div
              key={friend._id}
              className="flex items-center justify-between gap-2"
            >
              <Link
                to={`/profile/${friend.userName}`}
                className="flex items-center gap-2 overflow-hidden transition-opacity hover:opacity-80"
              >
                <img
                  src={friend.avatarUrl?.url || "/default-avatar.png"}
                  alt={friend.fullName}
                  className="h-10 w-10 shrink-0 rounded-full border object-cover"
                />

                <div className="flex flex-col truncate">
                  <span className="truncate text-sm font-semibold hover:underline">
                    {friend.fullName}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    @{friend.userName}
                  </span>
                </div>
              </Link>

              <div className="shrink-0">
                <FollowButton
                  userId={friend._id}
                  initialIsFollowing={friend.isFollowing}
                  followsMe={friend.followsMe}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/connect"
            className="text-primary text-xs font-semibold hover:underline"
          >
            View all suggestions →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default FriendSuggestionWidget;
