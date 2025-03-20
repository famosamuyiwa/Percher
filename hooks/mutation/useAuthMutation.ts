import { login } from "@/api/api.service";
import { ToastType } from "@/constants/enums";
import { useGlobalContext } from "@/lib/global-provider";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";

// Login Mutation
export const useLoginMutation = () => {
  const { displayToast } = useGlobalContext();

  const onUseLoginMutationError = (error: Error) => {
    displayToast({
      type: ToastType.ERROR,
      description: error.message,
    });
  };

  return useMutation({
    mutationFn: login,
    onError: onUseLoginMutationError,
  });
};
