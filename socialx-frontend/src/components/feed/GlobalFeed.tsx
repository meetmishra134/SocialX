import type { Post } from "@/types/post.types";
import PostCard from "../posts/PostCard";
import { motion } from "motion/react";
import { usePosts } from "@/hooks/usePosts";
import SkeletonCard from "../posts/SkeletonCard";

const GlobalFeed = () => {
  const { isLoading, isError, data: posts } = usePosts();
  console.log("Posts in GlobalFeed:", posts);
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
        posts?.map((post: Post) => <PostCard key={post._id} post={post} />)
      )}
    </motion.div>
  );
};

export default GlobalFeed;
