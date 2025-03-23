import { getCurrentUser } from "@/api/api.service";
import { USE_BOOKING_QUERY_KEY } from "@/constants/common";
import { useQuery } from "@tanstack/react-query";
import { BookingCache } from "@/utils/types";

export const useBookingQuery = () => {
  const query = useQuery<BookingCache>({
    queryKey: [USE_BOOKING_QUERY_KEY],
    queryFn: () => getCurrentUser(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  return query;
};
