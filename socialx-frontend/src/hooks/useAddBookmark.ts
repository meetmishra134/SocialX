import { postServices } from "@/services/post.services";
import { useAuth } from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// useAddBookmark.ts
export const useAddBookmark = (postId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postServices.toggleBookmark(postId as string),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["GlobalFeed"] });
      await queryClient.cancelQueries({ queryKey: ["SinglePost", postId] });

      const previousValue = queryClient.getQueryData<boolean>([
        "bookmark",
        postId,
      ]);
      queryClient.setQueryData(["bookmark", postId], !previousValue);

      return { previousValue };
    },

    onSuccess: (data) => {
      const currentUser = useAuth.getState().user;
      if (currentUser && postId) {
        const isCurrentlyBookmarked = currentUser.bookmarks.includes(postId);

        useAuth.setState({
          user: {
            ...currentUser,
            bookmarks: isCurrentlyBookmarked
              ? currentUser.bookmarks.filter((id) => id !== postId) // remove
              : [...currentUser.bookmarks, postId], // add
          },
        });
      }
      toast.success(data.message, { position: "top-center" });
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["bookmark", postId], context?.previousValue);
      toast.error("Something went wrong", { position: "top-center" });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["GlobalFeed"] });
      queryClient.invalidateQueries({ queryKey: ["SinglePost", postId] });
    },
  });
};
