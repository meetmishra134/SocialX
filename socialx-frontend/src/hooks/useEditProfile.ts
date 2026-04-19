import { userService } from "@/services/user.services";
import { useAuth } from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useEditProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => userService.editUserProfile(data),

    onSuccess: (updatedUser) => {
      const userId = updatedUser._id;
      queryClient.setQueryData(["profile", userId], updatedUser);
      useAuth.getState().updateUser(updatedUser);
    },
  });
};
