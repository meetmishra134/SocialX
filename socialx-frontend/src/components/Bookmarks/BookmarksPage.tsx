import type { Post } from "@/types/post.types";
import PostCard from "../posts/PostCard";
import { Lock, BookmarkX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useGetBookmarks } from "@/hooks/useGetBookmarks";
import { motion } from "motion/react";

const BookmarksPage = () => {
  const { data: posts } = useGetBookmarks();

  return (
    <div className="border-border mx-auto min-h-screen w-full max-w-2xl border-x pb-20">
      <div className="bg-background/80 border-border sticky top-0 z-10 border-b p-4 backdrop-blur-md sm:px-6">
        <h1 className="text-xl font-bold tracking-tight">Bookmarks</h1>

        <div className="text-muted-foreground mt-1.5 flex items-center gap-1.5 text-xs">
          <Lock className="h-3.5 w-3.5" />
          <span className="text-sm">Only you can see what you've saved</span>
        </div>
      </div>

      <div className="flex flex-col">
        {posts?.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-40 text-center">
            <div className="bg-muted mb-6 flex h-20 w-20 items-center justify-center rounded-full">
              <BookmarkX className="text-muted-foreground h-10 w-10 opacity-50" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">No bookmarks yet</h3>
            <p className="text-muted-foreground mb-8 max-w-sm">
              When you see something you want to remember, tap the bookmark icon
              to save it here.
            </p>
            <Button
              asChild
              variant="outline"
              className="rounded-full font-semibold"
            >
              <Link to="/feed/foryou">Explore the Feed</Link>
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="divide-border divide-y"
          >
            {posts?.map((post: Post) => (
              <div
                key={post._id}
                className="hover:bg-muted/30 transition-colors"
              >
                <PostCard post={post} />
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;
