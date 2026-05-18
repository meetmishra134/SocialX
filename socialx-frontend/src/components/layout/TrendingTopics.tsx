import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Hash, ChevronRight, Loader } from "lucide-react";
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

  return (
    <div className="bg-card sticky top-20 flex w-full flex-col rounded-2xl border shadow-sm">
      <div className="border-border border-b px-5 py-4">
        <h2 className="text-center text-base font-bold">Trending Topics</h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="text-muted-foreground animate-spin" size={20} />
        </div>
      ) : trendingTopics.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">
          No trending topics yet
        </p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col p-3"
        >
          {trendingTopics.map((topic: TrendingTopic) => (
            <motion.div key={topic._id} variants={itemVariants}>
              <Link
                to={`/topic/${topic._id}`}
                className="group hover:bg-muted flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Hash
                    size={16}
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                  />
                  <span className="text-foreground group-hover:text-primary font-semibold transition-colors">
                    {topic._id}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground text-xs">
                    {topic.postCount} {topic.postCount === 1 ? "post" : "posts"}
                  </span>
                  <ChevronRight
                    size={16}
                    className="text-muted-foreground -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default TrendingTopics;
