import { Link, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { useDiscovery } from "@/hooks/useDiscovery";
import type { UserCardType } from "@/types/user.types";
import FollowButton from "../connect/FollowButton";

const FriendSuggestionWidget = () => {
  const navigate = useNavigate();
  const { data, isLoading, isRefetching } = useDiscovery();
  const friendsSuggestion =
    data?.pages
      .flatMap((page) => (Array.isArray(page) ? page : (page?.users ?? [])))
      .filter((user): user is UserCardType => !!user?._id) ?? [];
  if (!friendsSuggestion || friendsSuggestion.length === 0) {
    return (
      <div className="bg-card w-full max-w-[350px] rounded-2xl border py-1">
        <h2 className="text-foreground px-4 py-2 text-center text-lg font-bold">
          Who to follow
        </h2>
        <p className="text-muted-foreground px-4 py-6 text-center text-sm">
          No suggestions available right now.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card w-full max-w-[350px] rounded-2xl border py-1">
      <h2 className="text-foreground px-4 py-2 text-center text-lg font-bold">
        Who to follow
      </h2>

      <div className="flex flex-col">
        {isLoading || isRefetching ? (
          <div className="flex h-32 items-center justify-center">
            <Loader className="text-muted-foreground animate-spin" size={24} />
          </div>
        ) : (
          friendsSuggestion.slice(0, 3).map((friend: UserCardType) => (
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
                  <span className="text-foreground truncate text-[13px] leading-tight font-bold hover:underline">
                    {friend.fullName}
                  </span>
                  <span className="text-muted-foreground truncate text-[12px] leading-tight">
                    @{friend.userName}
                  </span>
                </div>
              </Link>

              <div className="ml-3 shrink-0">
                <FollowButton
                  userId={friend._id}
                  initialIsFollowing={friend.isFollowing}
                  followsMe={friend.followsMe}
                  isLoading={false}
                />
              </div>
            </div>
          ))
        )}
      </div>

      <p
        onClick={() => navigate("/explore?tab=people")}
        className="text-primary hover:bg-muted/50 block cursor-pointer rounded-b-2xl px-4 py-3 text-center text-[13px] font-normal transition-colors"
      >
        Show more
      </p>
    </div>
  );
};

export default FriendSuggestionWidget;
