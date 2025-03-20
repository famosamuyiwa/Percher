import { updateUser } from "@/api/api.service";
import { USE_AUTH_QUERY_KEY } from "@/constants/common";
import { ToastType } from "@/constants/enums";
import { ApiResponse } from "@/interfaces";
import { useGlobalContext } from "@/lib/global-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  const { displayToast } = useGlobalContext();

  //save user id to global store and update auth query with user data
  const onUseUpdateUserMutationSuccess = (payload: ApiResponse) => {
    queryClient.invalidateQueries({ queryKey: USE_AUTH_QUERY_KEY });
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
