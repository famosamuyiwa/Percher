import { getCurrentUser } from "@/api/api.service";
import { USE_AUTH_QUERY_KEY } from "@/constants/common";
import { useQuery } from "@tanstack/react-query";
import { AuthCache } from "@/utils/types";

export const useAuthQuery = () => {
  const query = useQuery<AuthCache>({
    queryKey: [USE_AUTH_QUERY_KEY],
    queryFn: () => getCurrentUser(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  return query;
};
