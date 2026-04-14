import { commentServices } from "@/services/comment.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: commentServices.createComment,
    onSuccess: (_data, variables) => {
      toast.success("Comment added successfully", { position: "top-center" });

      queryClient.invalidateQueries({
        queryKey: ["Comments", variables.postId],
      });
    },
    onError: () => {
      toast.error("Failed to add comment", {
        position: "top-center",
      });
    },
  });
};
