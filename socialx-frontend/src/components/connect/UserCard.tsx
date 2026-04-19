import type { UserCardType } from "@/types/user.types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";

interface UserCardProps {
  user: UserCardType;
  action?: React.ReactNode;
}

const UserCard = ({ user, action }: UserCardProps) => {
  return (
    <div className="hover:bg-muted flex items-start justify-between gap-2 rounded-xl p-3 transition">
      <div className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={user.avatarUrl?.url} />
          <AvatarFallback>{user.fullName[0]}</AvatarFallback>
        </Avatar>

        {/* 2. Add min-w-0 to the text column */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold hover:underline">
                <Link to={`/profile/${user._id}`}>{user.fullName}</Link>
              </p>
              <p className="text-muted-foreground truncate text-xs">
                @{user.userName}
              </p>
            </div>

            <div className="shrink-0">{action}</div>
          </div>

          {user.bio && (
            <p className="text-foreground mt-1 line-clamp-2 text-[13px] sm:mt-0.5">
              {user.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
