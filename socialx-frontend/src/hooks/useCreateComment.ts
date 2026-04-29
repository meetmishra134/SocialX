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
