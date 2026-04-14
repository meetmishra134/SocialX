import { useSinglePost } from "@/hooks/useSinglePost";
import { useNavigate, useParams } from "react-router-dom";
import PostCard from "./PostCard";
import { ArrowLeft, Loader } from "lucide-react";
import CommentInput from "../comments/CommentInput";
import Comment from "../comments/Comment";

const DetailedPost = () => {
  const { postId } = useParams();
  const { data: post, isLoading, error } = useSinglePost(postId);

  const navigate = useNavigate();
  return (
    <div>
      <div className="bg-background/30 sticky top-0 z-10 flex items-center gap-3 px-6 py-4 backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          className="hover:bg-muted cursor-pointer rounded-full p-1 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold">Post</h2>
      </div>
      {isLoading && (
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader className="animate-spin" size={30} />
        </div>
      )}
      {error && (
        <div className="flex min-h-[70vh] items-center justify-center">
          <p className="text-muted-foreground">Failed to load post.</p>
        </div>
      )}
      {post && <PostCard post={post} />}
      <div className="border-border border-b px-4 py-3">
        <CommentInput />
      </div>
      {/* Comments List */}
      <div className="mt-4 px-4">
        <Comment />
      </div>
    </div>
  );
};

export default DetailedPost;
