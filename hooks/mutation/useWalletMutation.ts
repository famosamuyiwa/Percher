import { updateWallet } from "@/api/api.service";
import { ToastType } from "@/constants/enums";
import { ApiResponse } from "@/interfaces";
import { useGlobalContext } from "@/lib/global-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { USE_WALLET_QUERY_KEY } from "@/constants/common";

export const useUpdateWalletMutation = () => {
  const queryClient = useQueryClient();
  const { displayToast } = useGlobalContext();

  const onUseUpdateWalletMutationSuccess = (payload: ApiResponse) => {
    queryClient.invalidateQueries({ queryKey: USE_WALLET_QUERY_KEY });
    displayToast({
      type: ToastType.SUCCESS,
      description: "Wallet updated successfully",
    });
  };

  const onUseUpdateWalletMutationError = (error: Error) => {
    displayToast({
      type: ToastType.ERROR,
      description: error.message,
    });
  };

  return useMutation({
    mutationFn: updateWallet,
    onSuccess: onUseUpdateWalletMutationSuccess,
    onError: onUseUpdateWalletMutationError,
  });
};
