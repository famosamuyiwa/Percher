import { updateUser } from "@/api/api.service";
import { USE_AUTH_QUERY_KEY } from "@/constants/common";
import { ToastType } from "@/constants/enums";
import { ApiResponse } from "@/interfaces";
import { useGlobalContext } from "@/lib/global-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  const { displayToast } = useGlobalContext();

  const onUseUpdateUserMutationSuccess = (payload: ApiResponse) => {
    queryClient.invalidateQueries({ queryKey: USE_AUTH_QUERY_KEY });
    displayToast({
      type: ToastType.SUCCESS,
      description: "Profile updated",
    });
  };

  const onUseUpdateUserMutationError = (error: Error) => {
    displayToast({
      type: ToastType.ERROR,
      description: error.message,
    });
  };

  return useMutation({
    mutationFn: updateUser,
    onSuccess: onUseUpdateUserMutationSuccess,
    onError: onUseUpdateUserMutationError,
  });
};
