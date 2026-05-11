import type { Post } from "@/types/post.types";
import PostCard from "../posts/PostCard";
import { motion } from "motion/react";
import { usePosts } from "@/hooks/usePosts";
import SkeletonCard from "../posts/SkeletonCard";
import { ArrowDownIcon, Loader } from "lucide-react";

const GlobalFeed = () => {
  const {
    isLoading,
    isError,
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = usePosts();
  // console.log("pages[0]:", data?.pages[0]);
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
      className="mx-auto flex w-full max-w-2xl flex-col gap-y-4 px-3 py-2"
    >
      {isLoading ? (
        [1, 2, 3].map((index) => <SkeletonCard key={index} />)
      ) : isError ? (
        <div className="flex min-h-[80vh] items-center justify-center">
          <p className="text-md text-center capitalize sm:text-xl">
            Something Went Wrong or No Posts Available.
          </p>
        </div>
      ) : (
        <>
          {posts?.map((post: Post) => (
            <PostCard key={post._id} post={post} variant="feed" />
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
    </motion.div>
  );
};

export default GlobalFeed;
