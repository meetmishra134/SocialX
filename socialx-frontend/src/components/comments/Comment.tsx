import type { CommentType } from "@/types/comment.types";
import CommentCard from "./CommentCard";
import { useComment } from "@/hooks/useComment";
import { useParams } from "react-router-dom";
import { LoaderIcon, MessagesSquareIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const Comment = () => {
  const { postId } = useParams();
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
  } = useComment(postId);
  const comments = data?.pages.flatMap((page) => page.comments) || [];
  return (
    <div>
      {isLoading && (
        <div className="flex min-h-[50vh] items-center justify-center">
          <LoaderIcon className="animate-spin" size={30} />
        </div>
      )}
      {isError && (
        <div className="flex min-h-[50vh] items-center justify-center">
          <MessagesSquareIcon size={30} />
          <p className="text-muted-foreground ml-2">Failed to load comments.</p>
        </div>
      )}
      <AnimatePresence mode="popLayout">
        {comments && comments.length > 0 ? (
          <div key="comment-list" className="space-y-4">
            {comments.map((comment: CommentType) => (
              <motion.div
                key={comment._id}
                layout
                initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 20, filter: "blur(10px)" }} // Keeping our slide-out fix!
                transition={{ duration: 0.3 }}
              >
                <CommentCard comment={comment} />
              </motion.div>
            ))}

            {hasNextPage && (
              <div className="flex justify-center py-4">
                <button
                  onClick={() => fetchNextPage()}
                  className="text-primary hover:underline"
                >
                  {isFetchingNextPage
                    ? "Loading more..."
                    : "Load More Comments"}
                </button>
              </div>
            )}
          </div>
        ) : (
          !isLoading &&
          !isError && (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[50vh] items-center justify-center"
            >
              <p className="text-muted-foreground">No comments yet.</p>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
};

export default Comment;
