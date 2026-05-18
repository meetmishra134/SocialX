import { ArrowDownIcon, ArrowLeft, Hash, Loader } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import type { Post } from "@/types/post.types";
import PostCard from "../posts/PostCard";
import { useSearch } from "@/hooks/useSearch";

const TopicFeed = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSearch(topic);

  const posts =
    data?.pages
      .flatMap((page) => (Array.isArray(page) ? page : (page?.posts ?? [])))
      .filter((post): post is Post => !!post?._id) ?? [];

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
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {isLoading ? (
          <div className="flex min-h-[70vh] items-center justify-center">
            <Loader className="mx-auto mt-10 animate-spin" />
          </div>
        ) : isError ? (
          <div className="text-muted-foreground mt-20 text-center">
            Failed to load posts for{" "}
            <span className="text-foreground font-semibold">#{topic}</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-muted-foreground mt-20 text-center">
            No posts found for{" "}
            <span className="text-foreground font-semibold">#{topic}.</span> Be
            the first to post!
          </div>
        ) : (
          <>
            {posts.map((post: Post) => (
              <PostCard key={post._id} post={post} />
            ))}

            <div className="flex w-full justify-center py-6">
              {hasNextPage && (
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer rounded-full px-6 py-2.5 text-sm font-semibold transition disabled:opacity-50"
                >
                  {isFetchingNextPage ? (
                    <Loader className="animate-spin" />
                  ) : (
                    <ArrowDownIcon className="animate-bounce" />
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TopicFeed;
