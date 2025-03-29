import { verifyPayment } from "@/api/api.service";
import { ToastType } from "@/constants/enums";
import { ApiResponse } from "@/interfaces";
import { useGlobalContext } from "@/lib/global-provider";
import { useMutation } from "@tanstack/react-query";

export const useVerifyPaymentMutation = () => {
  const { displayToast } = useGlobalContext();

  const onUseVerifyPaymentMutationSuccess = (payload: ApiResponse) => {};

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
