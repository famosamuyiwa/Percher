import {
  createBooking,
  discardBooking,
  reviewBooking,
} from "@/api/api.service";
import {
  USE_BOOKINGS_QUERY_KEY,
  USE_BOOKING_QUERY_KEY,
} from "@/constants/common";
import { ToastType } from "@/constants/enums";
import { ApiResponse } from "@/interfaces";
import { useGlobalContext } from "@/lib/global-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateBookingMutation = () => {
  const { displayToast } = useGlobalContext();

  const onUseCreateBookingMutationSuccess = (payload: ApiResponse) => {};

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

export const useDiscardBookingMutation = () => {
  const { displayToast } = useGlobalContext();

  const onUseDiscardBookingMutationSuccess = (payload: ApiResponse) => {};

  const onUseDiscardBookingMutationError = (error: Error) => {
    displayToast({
      type: ToastType.ERROR,
      description: error.message,
    });
  };

  return useMutation({
    mutationFn: discardBooking,
    onSuccess: onUseDiscardBookingMutationSuccess,
    onError: onUseDiscardBookingMutationError,
  });
};

export const useReviewBookingMutation = () => {
  const queryClient = useQueryClient();

  const { displayToast } = useGlobalContext();

  const onUseReviewBookingMutationSuccess = (payload: ApiResponse) => {
    queryClient.invalidateQueries({ queryKey: USE_BOOKING_QUERY_KEY });
  };

  const onUseReviewBookingMutationError = (error: Error) => {
    displayToast({
      type: ToastType.ERROR,
      description: error.message,
    });
  };

  return useMutation({
    mutationFn: reviewBooking,
    onSuccess: onUseReviewBookingMutationSuccess,
    onError: onUseReviewBookingMutationError,
  });
};
