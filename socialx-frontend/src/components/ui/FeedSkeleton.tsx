import { motion } from "motion/react";
import SkeletonCard from "../posts/SkeletonCard";
const FeedSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-y-4 px-3 py-4"
    >
      {[1, 2, 3].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </motion.div>
  );
};

export default FeedSkeleton;
