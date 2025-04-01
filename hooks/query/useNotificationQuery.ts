import { getAllNotifications } from "@/api/api.service";
import { USE_NOTIFICATIONS_QUERY_KEY } from "@/constants/common";
import { NotificationsCache } from "@/utils/types";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useNotificationQuery = () => {
  return useInfiniteQuery<NotificationsCache>({
    queryKey: [USE_NOTIFICATIONS_QUERY_KEY],
    queryFn: ({ pageParam = null }: any) => getAllNotifications(pageParam),
    retry: 3,
    retryDelay: 1 * 60 * 1000,
    staleTime: 0,
    initialPageParam: null, // Set the initial page param
    getNextPageParam: (lastPage) => lastPage.nextCursor || null, // Handle pagination with the cursor
  });
};
