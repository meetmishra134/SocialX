import { postServices } from "@/services/post.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeletePost = () => {
  const queryclient = useQueryClient();

  return useMutation({
    mutationFn: postServices.deletePost,
    onSuccess: (data) => {
      const successMessage = data?.message || "Post deleted successfully";
      toast.success(successMessage, { position: "top-center" });
      queryclient.invalidateQueries({ queryKey: ["GlobalFeed"] });
      queryclient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
        message?: string;
      };

      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "An error occurred while adding the comment.";
      toast.error(errorMessage, {
        position: "top-center",
      });
    },
  });
};
