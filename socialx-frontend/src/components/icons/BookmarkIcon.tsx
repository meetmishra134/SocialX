import { useAddBookmark } from "@/hooks/useAddBookmark";
import { useQuery } from "@tanstack/react-query";

interface BookmarkIconProps {
  postId: string;
  size?: number;
}

const BookmarkIcon = ({ postId, size = 20 }: BookmarkIconProps) => {
  const { mutate } = useAddBookmark(postId);

  const { data: isBookmarked = false } = useQuery<boolean>({
    queryKey: ["bookmark", postId],
    staleTime: Infinity,
    enabled: false,
  });

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    mutate();
  };

  return (
    <button
      onClick={handleBookmarkToggle}
      className={`group flex items-center transition-colors ${
        isBookmarked ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      <div className="group-hover:bg-foreground/10 rounded-full p-1.5 transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={isBookmarked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={isBookmarked ? "0" : "2"}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-bookmark-icon lucide-bookmark"
        >
          <path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" />
        </svg>
      </div>
    </button>
  );
};

export default BookmarkIcon;
