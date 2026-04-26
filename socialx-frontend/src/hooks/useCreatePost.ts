import { postServices } from "@/services/post.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postServices.createPost,
    onSuccess: (data) => {
      const successMessage = data?.message || "Post created successfully";
      toast.success(successMessage, { position: "top-center" });
      queryClient.invalidateQueries({ queryKey: ["GlobalFeed"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data.error ||
        error?.message ||
        "Failed to create post.";
      toast.error(errorMessage, {
        position: "top-center",
      });
    },
  });
};
