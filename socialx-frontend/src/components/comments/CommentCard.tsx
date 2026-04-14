import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getRelativeTime } from "@/lib/relativeTime";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Heart, MoreHorizontal, Trash2 } from "lucide-react";
import type { CommentType } from "@/types/comment.types";
import { useDeleteComment } from "@/hooks/useDeleteComment";

interface CommentCardProps {
  comment: CommentType;
}

const CommentCard = ({ comment }: CommentCardProps) => {
  const { mutate: deleteComment } = useDeleteComment(comment._id);
  const isMyComment = true; // Replace with actual logic to check if it's the user's comment
  return (
    <div className="group flex gap-3 py-4">
      <Avatar className="mt-0.5 h-8 w-8 shrink-0 sm:h-10 sm:w-10">
        <AvatarImage
          src={comment.author.avatarUrl.url}
          alt={comment.author.userName}
        />
        <AvatarFallback>{comment.author.userName.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col sm:flex-row sm:items-center sm:gap-1.5">
            <h4 className="truncate text-sm font-semibold">
              {comment.author.fullName}
            </h4>
            <div className="text-muted-foreground flex min-w-0 items-center gap-1 text-xs sm:text-sm">
              <span className="truncate">@{comment.author.userName}</span>
              <span className="shrink-0">·</span>
              <span className="shrink-0">
                {getRelativeTime(comment.createdAt)}
              </span>
            </div>
          </div>

          {isMyComment && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground h-6 w-6 shrink-0 rounded-full opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => deleteComment()}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <span className="text-foreground/90 mt-1 text-sm wrap-break-word whitespace-pre-wrap">
          {comment.text}
        </span>

        <div className="mt-2 flex gap-4">
          <button className="group/like text-muted-foreground flex items-center gap-1.5 transition-colors hover:text-red-500">
            <div className="rounded-full p-1 transition-colors group-hover/like:bg-red-500/10">
              <Heart className="h-4 w-4" />
            </div>

            <span className="text-xs font-medium">1</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
