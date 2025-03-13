import { getCurrentUser } from "@/api/api.service";
import { USE_AUTH_QUERY_KEY } from "@/constants/common";
import { useGlobalStore } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import { AuthCache } from "@/utils/types";

export const useAuthQuery = () => {
  const { jwt } = useGlobalStore();
  const query = useQuery<AuthCache>({
    queryKey: [USE_AUTH_QUERY_KEY], // Ensure re-fetch when jwt changes
    enabled: !!jwt, // Prevent running with empty JWT
    queryFn: () => getCurrentUser(),
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
