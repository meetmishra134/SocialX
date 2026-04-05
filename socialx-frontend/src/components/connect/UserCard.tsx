import type { UserCardType } from "@/types/user.types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserCardProps {
  user: UserCardType;
  action?: React.ReactNode;
}

const UserCard = ({ user, action }: UserCardProps) => {
  return (
    <div className="hover:bg-muted flex items-start justify-between gap-2 rounded-xl p-3 transition">
      <div className="flex flex-1 cursor-pointer items-start gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={user.avatarUrl?.url} />
          <AvatarFallback>{user.fullName[0]}</AvatarFallback>
        </Avatar>

        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">{user.fullName}</p>
              <p className="text-muted-foreground text-xs">@{user.userName}</p>
            </div>

            <div className="ml-[0.24px] sm:ml-auto">{action}</div>
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
