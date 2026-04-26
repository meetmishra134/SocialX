import { commentServices } from "@/services/comment.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteComment = (commentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => commentServices.deleteComment(commentId),
    onSuccess: (data) => {
      const successMessage =
        data?.data?.message || data?.message || "Comment deletedd successfully";
      toast.success(successMessage, { position: "top-center" });
      queryClient.invalidateQueries({ queryKey: ["Comments"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data.error ||
        error?.message ||
        "An error occurred while deleting the comment.";
      toast.error(errorMessage, { position: "top-center" });
    },
  });
};
