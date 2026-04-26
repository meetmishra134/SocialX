import { Link } from "react-router-dom";
import { Loader } from "lucide-react";
import { useDiscovery } from "@/hooks/useDiscovery";
import type { UserCardType } from "@/types/user.types";
import FollowButton from "../connect/FollowButton";

const FriendSuggestionWidget = () => {
  const { data: friendsSuggestion, isLoading, isRefetching } = useDiscovery();

  if (isLoading || isRefetching) {
    return (
      <div className="bg-card flex h-32 w-full max-w-[350px] items-center justify-center rounded-2xl border">
        <Loader className="text-muted-foreground animate-spin" size={24} />
      </div>
    );
  }

  if (!friendsSuggestion || friendsSuggestion.length === 0) {
    return null;
  }

  return (
    <div className="bg-card w-full max-w-[350px] rounded-2xl border py-1">
      <h2 className="text-foreground px-4 py-3 text-center text-lg font-extrabold">
        Who to follow
      </h2>

      <div className="flex flex-col">
        {friendsSuggestion.slice(0, 3).map((friend: UserCardType) => (
          <div
            key={friend._id}
            className="hover:bg-muted/50 flex items-center justify-between px-4 py-3 transition-colors"
          >
            <Link
              to={`/profile/${friend._id}`}
              className="flex min-w-0 flex-1 items-center gap-3"
            >
              <img
                src={friend.avatarUrl?.url || "/default-avatar.png"}
                alt={friend.fullName}
                className="bg-muted h-10 w-10 shrink-0 rounded-full object-cover"
              />

              <div className="flex min-w-0 flex-col">
                <span className="text-foreground truncate text-[15px] leading-tight font-bold hover:underline">
                  {friend.fullName}
                </span>
                <span className="text-muted-foreground truncate text-[15px] leading-tight">
                  @{friend.userName}
                </span>
              </div>
            </Link>

            <div className="ml-3 shrink-0">
              <FollowButton
                userId={friend._id}
                initialIsFollowing={friend.isFollowing}
                followsMe={friend.followsMe}
              />
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/connect"
        className="text-primary hover:bg-muted/50 block rounded-b-2xl px-4 py-4 text-center text-[15px] font-normal transition-colors"
      >
        Show more
      </Link>
    </div>
  );
};

export default FriendSuggestionWidget;
