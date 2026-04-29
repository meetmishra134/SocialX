import { postServices } from "@/services/post.services";
import { useQuery } from "@tanstack/react-query";

export const useGetTopics = () => {
  return useQuery({
    queryKey: ["TrendingTopics"],
    queryFn: () => postServices.getPostByTopic(),
    staleTime: 1000 * 60 * 20, // Cache for 20 minutes
  });
};
