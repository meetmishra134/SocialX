import { cn } from "@/lib/utils";
import { postServices } from "@/services/post.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface HeartIconProps {
  postId: string;
  size?: number;
}

const HeartIcon = ({ size = 20, postId }: HeartIconProps) => {
  const queryClient = useQueryClient();

  const { data: isLiked = false } = useQuery<boolean>({
    queryKey: ["like", postId],
    staleTime: Infinity,
    enabled: false,
  });

  const { data: likesCount = 0 } = useQuery<number>({
    queryKey: ["likesCount", postId], //
    staleTime: Infinity,
    enabled: false, //
  });

  const { mutate } = useMutation({
    mutationFn: () => postServices.toggleLike(postId),
    onMutate: () => {
      queryClient.setQueryData(["like", postId], !isLiked);
      queryClient.setQueryData(
        ["likesCount", postId],
        isLiked ? likesCount - 1 : likesCount + 1,
      );
    },
    onError: () => {
      queryClient.setQueryData(["like", postId], isLiked);
      queryClient.setQueryData(["likesCount", postId], likesCount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GlobalFeed"] });
      queryClient.invalidateQueries({ queryKey: ["SinglePost", postId] });
    },
  });

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    mutate();
  };

  return (
    <button
      onClick={handleLikeToggle}
      className="group flex items-center gap-1.5 transition-colors hover:text-red-500"
    >
      <div
        className={cn(
          "rounded-full p-1.5 transition-colors group-hover:bg-red-500/10",
          isLiked && "text-red-500",
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
          "text-xs font-medium",
          isLiked ? "text-red-500" : "text-muted-foreground",
        )}
      >
        {likesCount > 0 ? likesCount : 0}
      </span>
    </button>
  );
};

export default HeartIcon;
