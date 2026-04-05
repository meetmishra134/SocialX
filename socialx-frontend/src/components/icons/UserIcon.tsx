interface UserIconProps {
  isFilled: boolean;
  size?: number;
}

const UserIcon = ({ isFilled, size = 25 }: UserIconProps) => {
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
      className="lucide lucide-user-round-icon lucide-user-round"
    >
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  );
};

export default UserIcon;
