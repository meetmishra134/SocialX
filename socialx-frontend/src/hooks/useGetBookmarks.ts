import { userService } from "@/services/user.services";
import { useQuery } from "@tanstack/react-query";

export const useGetBookmarks = () => {
  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => userService.getBookmarks(),
  });
};
