import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface TopicChipProps {
  topic: string;
  className?: string;
}

const TopicChip = ({ topic, className }: TopicChipProps) => {
  const navigate = useNavigate();
  const handleChipClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/topic/${encodeURIComponent(topic.toLowerCase())}`);
  };
  return (
    <button
      onClick={handleChipClick}
      className={cn(
        "cursor-pointer rounded-full p-1 text-xs font-medium transition-colors",
        "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground flex items-center gap-1",
        className,
      )}
    >
      #{topic}
    </button>
  );
};

export default TopicChip;
