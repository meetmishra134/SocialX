interface BellRingProps {
  isFilled: boolean;
  size?: number;
  unreadCount: number;
}

const BellRing = ({ isFilled, size, unreadCount }: BellRingProps) => {
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={isFilled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={isFilled ? "0" : "2"}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-bell-ring-icon lucide-bell-ring transition-transform active:scale-90"
      >
        <path d="M10.268 21a2 2 0 0 0 3.464 0" />
        <path d="M22 8c0-2.3-.8-4.3-2-6" />
        <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
        <path d="M4 2C2.8 3.7 2 5.7 2 8" />
      </svg>

      {unreadCount > 0 && (
        <span className="ring-background absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white tabular-nums ring-2">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </div>
  );
};

export default BellRing;
