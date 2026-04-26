import { commentServices } from "@/services/comment.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: commentServices.createComment,
    onSuccess: (data, variables) => {
      const successMessage =
        data?.data?.message || data?.message || "Comment added successfully";
      toast.success(successMessage, { position: "top-center" });

      queryClient.invalidateQueries({
        queryKey: ["Comments", variables.postId],
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data.error ||
        error?.message ||
        "An error occurred while adding the comment.";
      toast.error(errorMessage, {
        position: "top-center",
      });
    },
  });
};
