import { postServices } from "@/services/post.services";
import { useQuery } from "@tanstack/react-query";

export const useSearch = (topic: string | undefined) => {
  return useQuery({
    queryKey: ["GlobalFeed", "topic", topic],
    queryFn: () => postServices.fetchPostsByTopic(topic as string),
    enabled: !!topic,
    staleTime: 60 * 1000,
  });
};
