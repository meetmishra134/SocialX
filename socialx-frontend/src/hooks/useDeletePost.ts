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
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data.error ||
        error?.message ||
        "An error occurred while deleting post.";
      toast.error(errorMessage, { position: "top-center" });
    },
  });
};
