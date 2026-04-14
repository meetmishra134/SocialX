import type { CommentType } from "@/types/comment.types";
import CommentCard from "./CommentCard";
import { useComment } from "@/hooks/useComment";
import { useParams } from "react-router-dom";
import { LoaderIcon, MessagesSquareIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
// const comment: CommentType[] = [
//   {
//     _id: "1",
//     author: {
//       _id: "123",
//       userName: "John Doe",
//       fullName: "Johnathan Doe",
//       avatarUrl: {
//         url: "https://randomuser.me/api/portraits/men/45.jpg",
//       },
//     },
//     text: "This is a sample comment.",
//     createdAt: new Date().toISOString(),
//     likes: ["1", "2", "3", "4", "5"],
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     _id: "2",
//     author: {
//       _id: "234",
//       userName: "John Doe",
//       fullName: "Johnathan Doe",
//       avatarUrl: {
//         url: "https://randomuser.me/api/portraits/men/45.jpg",
//       },
//     },
//     text: "This is a sample comment.",
//     createdAt: new Date().toISOString(),
//     likes: ["1", "2", "3", "4", "5"],
//     updatedAt: new Date().toISOString(),
//   },
// ];

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
      {comments && comments.length > 0 ? (
        <AnimatePresence>
          {comments.map((comment: CommentType) => (
            <motion.div
              key={comment._id}
              layout
              initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.3 }}
            >
              <CommentCard comment={comment} />
            </motion.div>
          ))}
          {hasNextPage && (
            <div className="flex justify-center py-4">
              <button onClick={() => fetchNextPage()}>
                {isFetchingNextPage ? "Loading more..." : "Load More Comments"}
              </button>
            </div>
          )}
        </AnimatePresence>
      ) : (
        !isLoading &&
        !isError && (
          <div className="flex min-h-[50vh] items-center justify-center">
            <p className="text-muted-foreground">No comments yet.</p>
          </div>
        )
      )}
    </div>
  );
};

export default Comment;
