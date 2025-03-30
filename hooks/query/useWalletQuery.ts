import { getWallet } from "@/api/api.service";
import { useQuery } from "@tanstack/react-query";
import { USE_WALLET_QUERY_KEY } from "@/constants/common";
import { WalletCache } from "@/utils/types";

export const useWalletQuery = () => {
  return useQuery<WalletCache>({
    queryKey: USE_WALLET_QUERY_KEY,
    queryFn: () => getWallet(),
    retry: 3,
    retryDelay: 1 * 60 * 1000,
    staleTime: 0,
  });
};
