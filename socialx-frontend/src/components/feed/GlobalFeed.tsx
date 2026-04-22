import type { Post } from "@/types/post.types";
import PostCard from "../posts/PostCard";
import { motion } from "motion/react";
import { usePosts } from "@/hooks/usePosts";
import SkeletonCard from "../posts/SkeletonCard";
import { ArrowDownIcon, Loader } from "lucide-react";
import { useLikeSync } from "@/hooks/useLikeSync";

const GlobalFeed = () => {
  useLikeSync();
  const {
    isLoading,
    isError,
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = usePosts();
  console.log("pages[0]:", data?.pages[0]);
  // console.log("posts:", posts);
  const posts =
    data?.pages
      .flatMap((page) => (Array.isArray(page) ? page : (page?.posts ?? [])))
      .filter((post): post is Post => !!post?._id) ?? [];
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 p-4"
    >
      {isLoading ? (
        [1, 2, 3].map((index) => <SkeletonCard key={index} />)
      ) : isError ? (
        <div className="flex min-h-[80vh] items-center justify-center">
          <p className="text-lg capitalize sm:text-xl">Error loading posts.</p>
        </div>
      ) : (
        <>
          {posts?.map((post: Post) => (
            <PostCard key={post._id} post={post} />
          ))}

          <div className="flex w-full justify-center py-6">
            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 py-2.5 text-sm font-semibold transition disabled:opacity-50"
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
    </motion.div>
  );
};

export default GlobalFeed;
