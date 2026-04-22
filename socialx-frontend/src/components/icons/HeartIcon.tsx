import { useLike } from "@/hooks/useLike";
import { cn } from "@/lib/utils";

import type { Post } from "@/types/post.types";

interface HeartIconProps {
  post: Post;
  size?: number;
  currentUserId: string;
}

const HeartIcon = ({ size = 20, post, currentUserId }: HeartIconProps) => {
  const { mutate: toggleLike, isPending } = useLike();
  const isLiked = post.likes?.includes(currentUserId) || false;
  const likesCount = post.likes?.length || 0;
  return (
    <button
      onClick={() => toggleLike(post._id)}
      disabled={isPending}
      className="group flex cursor-pointer items-center gap-1.5 transition-colors hover:text-red-500"
    >
      <div
        className={cn(
          "rounded-full p-1.5 transition-colors group-hover:bg-red-500/10",
          isLiked ? "text-red-500" : "text-primary",
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={isLiked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
        </svg>
      </div>
      <span
        className={cn(
          "text-sm font-medium",
          isLiked ? "text-red-500" : "text-primary",
        )}
      >
        {likesCount}
      </span>
    </button>
  );
};

export default HeartIcon;
