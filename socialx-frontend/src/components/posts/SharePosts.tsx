import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareButtonProps {
  postId: string;
  postTitle: string;
}

const SharePosts = ({ postId, postTitle }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  const postUrl = `${window.location.origin}/post/${postId}`;
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this post on SocialX!",
          text: postTitle,
          url: postUrl,
        });
        console.log("Post shared successfully");
      } catch (error) {
        console.error("Error sharing post:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(postUrl);
        setCopied(true);
        toast.success("link copied to clipboard!");
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (error) {
        console.error("Error copying link to clipboard:", error);
      }
    }
  };
  return (
    <button
      className="text-primary hover:text-primary/80 flex cursor-pointer items-center gap-1 transition-colors"
      onClick={handleShare}
    >
      {copied ? (
        <Check className="h-5 w-5 text-green-500" />
      ) : (
        <Share2 className="h-5 w-5" size={19} />
      )}
    </button>
  );
};

export default SharePosts;
