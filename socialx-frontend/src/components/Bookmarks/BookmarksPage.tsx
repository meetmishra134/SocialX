import type { Post } from "@/types/post.types";
import PostCard from "../posts/PostCard";
import { Lock, BookmarkX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useGetBookmarks } from "@/hooks/useGetBookmarks";
import { motion } from "motion/react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const BookmarksPage = () => {
  const { data: posts } = useGetBookmarks();
  useDocumentTitle("Bookmarks");
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
          <div className="flex min-h-[70vh] flex-col items-center justify-center px-3 text-center">
            <div className="bg-muted mb-2.5 flex h-16 w-16 items-center justify-center rounded-full">
              <BookmarkX className="text-muted-foreground h-8 w-8 opacity-60" />
            </div>

            <p className="text-foreground mt-4 text-lg font-medium">
              No bookmarks to see here yet
            </p>

            <p className="text-muted-foreground text-sm">
              When you save posts, they will appear here for you
            </p>

            <Button
              asChild
              variant="outline"
              className="mt-5 rounded-full px-5 text-sm font-medium"
            >
              <Link to="/feed/foryou">Explore Feed</Link>
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
