import { postServices } from "@/services/post.services";
import { useQuery } from "@tanstack/react-query";

export const usePosts = () => {
  return useQuery({
    queryKey: ["GlobalFeed"],
    queryFn: postServices.getPost,
    // refetchInterval: 5000,
  });
};
