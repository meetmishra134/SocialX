import { ArrowLeft, Hash } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "../ui/spinner";
import type { Post } from "@/types/post.types";
import PostCard from "../posts/PostCard";

const TopicFeed = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-2xl pb-24">
      <div className="bg-background/80 sticky top-0 z-10 flex items-center gap-4 border-b p-2 backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          className="hover:bg-muted rounded-full p-2 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex flex-col">
          <h1 className="flex items-center gap-1 text-xl font-bold">
            <Hash className="text-muted-foreground h-5 w-5" />
            {topic}
          </h1>
          <span className="text-muted-foreground text-sm">
            {posts?.length || 0} posts
          </span>
        </div>
      </div>

      {/* The Feed */}
      <div className="flex flex-col gap-4 p-4">
        {isLoading ? (
          <div className="min-h-[70vh]">
            <Spinner className="mx-auto mt-10" />
          </div>
        ) : posts?.length === 0 ? (
          <div className="text-muted-foreground mt-20 text-center">
            No posts found for{" "}
            <span className="text-foreground font-semibold">#{topic}.</span> Be
            the first to post!
          </div>
        ) : (
          posts?.map((post: Post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default TopicFeed;
