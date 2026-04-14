import { commentServices } from "@/services/comment.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteComment = (commentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => commentServices.deleteComment(commentId),
    onSuccess: () => {
      toast.success("Comment deleted successfully", { position: "top-center" });
      queryClient.invalidateQueries({ queryKey: ["Comments"] });
    },
    onError: () => {
      toast.error("Failed to delete comment", { position: "top-center" });
    },
  });
};
