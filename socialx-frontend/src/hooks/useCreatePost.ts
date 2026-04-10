import { postServices } from "@/services/post.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postServices.createPost,
    onSuccess: () => {
      toast.success("Post created successfully", { position: "top-center" });
      queryClient.invalidateQueries({ queryKey: ["GlobalFeed"] });
    },
    onError: () => {
      toast.error("Failed to create post", {
        position: "top-center",
      });
    },
  });
};
