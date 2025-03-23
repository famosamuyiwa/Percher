import { createProperty } from "@/api/api.service";
import {
  USE_AUTH_QUERY_KEY,
  USE_OWNED_PROPERTIES_QUERY_KEY,
} from "@/constants/common";
import { ToastType } from "@/constants/enums";
import { ApiResponse } from "@/interfaces";
import { useGlobalContext } from "@/lib/global-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreatePropertyMutation = () => {
  const queryClient = useQueryClient();
  const { displayToast } = useGlobalContext();

  const onUseCreatePropertyMutationSuccess = (payload: ApiResponse) => {
    queryClient.invalidateQueries({ queryKey: USE_OWNED_PROPERTIES_QUERY_KEY });
    displayToast({
      type: ToastType.SUCCESS,
      description: "Perch awaiting approval",
    });
  };

  const onUseCreatePropertyMutationError = (error: Error) => {
    displayToast({
      type: ToastType.ERROR,
      description: error.message,
    });
  };

  return useMutation({
    mutationFn: createProperty,
    onSuccess: onUseCreatePropertyMutationSuccess,
    onError: onUseCreatePropertyMutationError,
  });
};
