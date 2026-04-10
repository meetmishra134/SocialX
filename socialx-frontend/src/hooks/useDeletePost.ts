import { postServices } from "@/services/post.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeletePost = () => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: postServices.deletePost,
    onSuccess: () => {
      toast.success("Post deleted successfully", { position: "top-center" });
      queryclient.invalidateQueries({ queryKey: ["GlobalFeed"] });
    },
    onError: () => {
      toast.error("Failed to delete post", { position: "top-center" });
    },
  });
};
