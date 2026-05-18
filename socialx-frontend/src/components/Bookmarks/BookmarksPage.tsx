import { useGetBookmarks } from "@/hooks/useGetBookmarks";
import { BookmarkX, Loader } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import type { Post } from "@/types/post.types";
import PostCard from "../posts/PostCard";
import { motion } from "motion/react";
const BookmarksPage = () => {
  const { data: posts, isLoading, isError } = useGetBookmarks();
  return (
    <div className="w-full">
      <div className="flex flex-col">
        {isError && (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground text-sm">
              Failed to load bookmarks.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader className="text-primary animate-spin" size={25} />
          </div>
        )}

        {!isLoading && !isError && posts?.length === 0 && (
          <div className="flex flex-col items-center justify-center px-3 py-20 text-center">
            <div className="bg-muted mb-2.5 flex h-16 w-16 items-center justify-center rounded-full">
              <BookmarkX className="text-muted-foreground h-8 w-8 opacity-60" />
            </div>

            <p className="text-foreground mt-4 text-lg font-medium">
              No bookmarks to see here yet
            </p>

            <p className="text-muted-foreground mt-1 text-sm">
              When you save posts, they will appear here for you.
            </p>

            <Button
              asChild
              variant="outline"
              className="mt-6 rounded-full px-5 text-sm font-medium"
            >
              <Link to="/feed/foryou">Explore Feed</Link>
            </Button>
          </div>
        )}

        {!isLoading && !isError && posts && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="divide-border divide-y"
          >
            {posts.map((post: Post) => (
              <div
                key={post._id}
                className="hover:bg-muted/30 transition-colors"
              >
                <PostCard post={post} variant="profile" />
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;
