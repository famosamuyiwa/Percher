import {
  getAllBookings,
  getBookingById,
  getCurrentUser,
} from "@/api/api.service";
import {
  USE_BOOKINGS_QUERY_KEY,
  USE_BOOKING_QUERY_KEY,
} from "@/constants/common";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { BookingCache, BookingsCache } from "@/utils/types";
import { Filter } from "@/interfaces";

export const useBookingsQuery = (filters: Filter) => {
  return useInfiniteQuery<BookingsCache>({
    queryKey: [USE_BOOKINGS_QUERY_KEY, filters],
    queryFn: ({ pageParam = null }: any) => getAllBookings(pageParam, filters),
    retry: 3,
    retryDelay: 1 * 60 * 1000,
    staleTime: 0,
    initialPageParam: null, // Set the initial page param
    getNextPageParam: (lastPage) => lastPage.nextCursor || null, // Handle pagination with the cursor
  });
};

export const useBookingQuery = (id: number) => {
  return useQuery<BookingCache>({
    queryKey: USE_BOOKING_QUERY_KEY,
    queryFn: () => getBookingById(id),
    enabled: !!id,
    retry: 3,
    retryDelay: 1 * 60 * 1000,
    staleTime: 0,
  });
};
