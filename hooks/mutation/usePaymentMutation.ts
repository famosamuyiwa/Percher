import { createPayment, updatePayment, verifyPayment } from "@/api/api.service";
import { USE_WALLET_QUERY_KEY } from "@/constants/common";
import { ToastType } from "@/constants/enums";
import { ApiResponse } from "@/interfaces";
import { useGlobalContext } from "@/lib/global-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useVerifyPaymentMutation = () => {
  const queryClient = useQueryClient();
  const { displayToast } = useGlobalContext();

  const onUseVerifyPaymentMutationSuccess = (payload: ApiResponse) => {
    console.log("verified");
    queryClient.invalidateQueries({ queryKey: USE_WALLET_QUERY_KEY });
  };

  const onUseVerifyPaymentMutationError = (error: Error) => {
    displayToast({
      type: ToastType.ERROR,
      description: error.message,
    });
  };

  return useMutation({
    mutationFn: verifyPayment,
    onSuccess: onUseVerifyPaymentMutationSuccess,
    onError: onUseVerifyPaymentMutationError,
  });
};

export const useCreatePaymentMutation = () => {
  const { displayToast } = useGlobalContext();

  const onUseCreatePaymentMutationSuccess = (payload: ApiResponse) => {};

  const onUseCreatePaymentMutationError = (error: Error) => {
    displayToast({
      type: ToastType.ERROR,
      description: error.message,
    });
  };

  return useMutation({
    mutationFn: createPayment,
    onSuccess: onUseCreatePaymentMutationSuccess,
    onError: onUseCreatePaymentMutationError,
  });
};

export const useUpdatePaymentMutation = () => {
  const { displayToast } = useGlobalContext();

  const onUseUpdatePaymentMutationSuccess = (payload: ApiResponse) => {};

  const onUseUpdatePaymentMutationError = (error: Error) => {
    displayToast({
      type: ToastType.ERROR,
      description: error.message,
    });
  };

  return useMutation({
    mutationFn: updatePayment,
    onSuccess: onUseUpdatePaymentMutationSuccess,
    onError: onUseUpdatePaymentMutationError,
  });
};
