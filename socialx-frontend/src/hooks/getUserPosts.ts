import { postServices } from "@/services/post.services";
import { useQuery } from "@tanstack/react-query";

export const useGetUserPosts = (userName: string | undefined) => {
  return useQuery({
    queryKey: ["userPosts", userName],
    queryFn: () => postServices.getUserPosts(userName as string),
    enabled: !!userName,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
