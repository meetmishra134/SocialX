import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Hash, ChevronRight } from "lucide-react";
import { useGetTopics } from "@/hooks/useGetTopics";

interface TrendingTopic {
  _id: string;
  postCount: number;
}

const TrendingTopics = () => {
  const { data: topics, isLoading } = useGetTopics();
  const trendingTopics = topics?.slice(0, 5) || [];
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 },
  };

  if (isLoading) {
    return (
      <div className="bg-muted/50 h-48 w-full animate-pulse rounded-2xl" />
    );
  }

  return (
    <div className="bg-card sticky top-20 flex w-full flex-col gap-4 rounded-2xl border p-5 shadow-sm">
      <div className="flex items-center justify-center gap-2 pb-2">
        <h2 className="text-lg font-bold">Trending Topics</h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col"
      >
        {trendingTopics?.map((topic: TrendingTopic) => (
          <motion.div key={topic._id} variants={itemVariants}>
            <Link
              to={`/topic/${topic._id}`}
              className="group hover:bg-muted flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <Hash
                    size={16}
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                  />
                  <span className="text-foreground group-hover:text-primary font-semibold transition-colors">
                    {topic._id}
                  </span>
                </div>

                <span className="text-muted-foreground text-xs">
                  {topic.postCount} {topic.postCount === 1 ? "post" : "posts"}
                </span>
              </div>

              <ChevronRight
                size={16}
                className="text-muted-foreground -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
              />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default TrendingTopics;
