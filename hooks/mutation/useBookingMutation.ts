import { createBooking } from "@/api/api.service";
import { USE_BOOKINGS_QUERY_KEY } from "@/constants/common";
import { ToastType } from "@/constants/enums";
import { ApiResponse } from "@/interfaces";
import { useGlobalContext } from "@/lib/global-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateBookingMutation = () => {
  const queryClient = useQueryClient();
  const { displayToast } = useGlobalContext();

  const onUseCreateBookingMutationSuccess = (payload: ApiResponse) => {
    queryClient.invalidateQueries({ queryKey: USE_BOOKINGS_QUERY_KEY });
  };

  const onUseCreateBookingMutationError = (error: Error) => {
    displayToast({
      type: ToastType.ERROR,
      description: error.message,
    });
  };

  return useMutation({
    mutationFn: createBooking,
    onSuccess: onUseCreateBookingMutationSuccess,
    onError: onUseCreateBookingMutationError,
  });
};
