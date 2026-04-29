import { postServices } from "@/services/post.services";
import { useAuth } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddBookmark = (postId: string) => {
  const user = useAuth((state) => state.user);
  const setUser = useAuth((state) => state.updateUser);

  return useMutation({
    mutationFn: () => postServices.toggleBookmark(postId),

    onMutate: () => {
      if (!user) return;
      const isBookmarked = user.bookmarks?.includes(postId) ?? false;
      setUser({
        ...user,
        bookmarks: isBookmarked
          ? user.bookmarks!.filter((id) => id !== postId)
          : [...(user.bookmarks || []), postId],
      });
      toast.success(isBookmarked ? "Bookmark removed" : "Bookmark added", {
        position: "top-center",
      });
    },

    onError: () => {
      if (!user) return;
      const isBookmarked = user.bookmarks?.includes(postId) ?? false;
      setUser({
        ...user,
        bookmarks: isBookmarked
          ? user.bookmarks!.filter((id) => id !== postId)
          : [...(user.bookmarks || []), postId],
      });
    },
  });
};
