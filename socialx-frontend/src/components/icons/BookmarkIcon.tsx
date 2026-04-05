interface BookmarkIconProps {
  isFilled?: boolean;
  size?: number;
}

const BookmarkIcon = ({ isFilled, size = 25 }: BookmarkIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFilled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={isFilled ? "0" : "2"}
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-bookmark-icon lucide-bookmark"
    >
      <path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" />
    </svg>
  );
};

export default BookmarkIcon;
