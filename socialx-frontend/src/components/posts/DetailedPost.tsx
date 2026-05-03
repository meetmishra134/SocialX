import { useSinglePost } from "@/hooks/useSinglePost";
import { useNavigate, useParams } from "react-router-dom";
import PostCard from "./PostCard";
import { ArrowLeft, Loader } from "lucide-react";
import CommentInput from "../comments/CommentInput";
import Comment from "../comments/Comment";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const DetailedPost = () => {
  const { postId } = useParams();

  const { data: post, isLoading, error } = useSinglePost(postId);

  const navigate = useNavigate();
  const plainText = post?.text.replace(/<[^>]+>/g, "");
  useDocumentTitle(post ? plainText.slice(0, 20) + "..." : "Post");
  return (
    <div className="pb-20">
      <div className="bg-background/80 sticky top-0 z-10 flex items-center gap-3 border-b border-gray-700 px-4 py-3 backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white/10 active:scale-95"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-base font-semibold">Post</h2>
      </div>

      {isLoading && (
        <div className="flex min-h-[60vh] items-center justify-center text-gray-400">
          <Loader className="animate-spin" size={28} />
        </div>
      )}

      {error && (
        <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
          Failed to load post.
        </div>
      )}

      {post && (
        <>
          <div className="border-b border-gray-700">
            <PostCard post={post} />
          </div>

          <div className="border-b border-gray-700 px-4 py-3">
            <CommentInput />
          </div>
        </>
      )}

      <div className="divide-y divide-gray-700">
        <Comment />
      </div>
    </div>
  );
};

export default DetailedPost;
