// import { getUserById } from "@/api/api.service";
// import { USE_AUTH_QUERY_KEY } from "@/constants/common";
// import { useGlobalStore } from "@/store/store";
// import { useQuery } from "@tanstack/react-query";
// import { AuthCache } from "@/utils/types";

// export const useAuthQuery = () => {
//   const { userId } = useGlobalStore();
//   return useQuery<AuthCache>({
//     queryKey: USE_AUTH_QUERY_KEY,
//     queryFn: () => getUserById(userId ?? -1), //get logged in user data by id in local store
//   });
// };
