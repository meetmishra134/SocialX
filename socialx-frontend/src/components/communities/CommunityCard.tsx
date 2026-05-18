import { useAuth } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Check, FileText, Users2 } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useJoinCommunity, useLeaveCommunity } from "@/hooks/useCommunity";

export interface CommunityCardProps {
  community: {
    _id: string;
    name: string;
    description: string;
    avatar?: { url: string };
    creator: string;
    membersCount: number;
    postsCount: number;
    members: string[];
  };
}
const CommunityCard = ({ community }: CommunityCardProps) => {
  const user = useAuth((state) => state.user);

  const isJoined = community.members.includes(user?._id as string);
  const { mutate: joinCommunity, isPending: isJoining } = useJoinCommunity();
  const { mutate: leaveCommunity, isPending: isLeaving } = useLeaveCommunity();

  const colorMap: Record<string, { bg: string; text: string }> = {
    A: { bg: "#EEEDFE", text: "#534AB7" },
    B: { bg: "#E1F5EE", text: "#0F6E56" },
    C: { bg: "#EEEDFE", text: "#534AB7" },
    D: { bg: "#FAECE7", text: "#993C1D" },
    E: { bg: "#FBEAF0", text: "#993556" },
    F: { bg: "#E1F5EE", text: "#0F6E56" },
  };
  const color = colorMap[community.name[0].toUpperCase()] ?? {
    bg: "#EEEDFE",
    text: "#534AB7",
  };

  return (
    <div className="bg-card border-border flex flex-col gap-3 rounded-xl border p-4">
      {/* top — avatar + name + category */}
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 rounded-xl">
          <AvatarImage src={community.avatar?.url} />
          <AvatarFallback
            className="rounded-xl text-lg font-medium"
            style={{ background: color.bg, color: color.text }}
          >
            {community.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <Link
            className="hover:text-decoration-primary cursor-pointer text-[15px] font-medium hover:underline"
            to={`/communities/${community._id}`}
          >
            {community.name}
          </Link>
          <p className="text-muted-foreground text-xs">
            {community.description?.slice(0, 30)}...
          </p>
        </div>
      </div>

      {/* description */}
      <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
        {community.description}
      </p>

      {/* stats */}
      <div className="border-border flex gap-4 border-t pt-3">
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Users2 className="h-3.5 w-3.5" />
          <strong className="text-foreground text-[13px] font-medium">
            {community.membersCount.toLocaleString()}
          </strong>
          members
        </span>
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <FileText className="h-3.5 w-3.5" />
          <strong className="text-foreground text-[13px] font-medium">
            {community.postsCount}
          </strong>
          posts
        </span>
      </div>

      {/* join / leave */}
      {isJoined ? (
        <Button
          variant="outline"
          size="sm"
          disabled={isLeaving}
          onClick={() => leaveCommunity(community._id)}
          className="w-full rounded-lg"
        >
          <Check className="mr-1.5 h-3.5 w-3.5" />
          Joined
        </Button>
      ) : (
        <Button
          size="sm"
          disabled={isJoining}
          onClick={() => joinCommunity(community._id)}
          className="w-full cursor-pointer rounded-lg"
        >
          {isJoining ? "Joining..." : "Join"}
        </Button>
      )}
    </div>
  );
};
export default CommunityCard;
