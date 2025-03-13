import { login } from "@/api/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthCache } from "@/utils/types";
import { USE_AUTH_QUERY_KEY } from "@/constants/common";
import { Alert } from "react-native";
import { ApiResponse, User } from "@/interfaces";

// Login Mutation
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  const onUseLoginMutationSuccess = (payload: ApiResponse<User>) => {
    queryClient.setQueryData<AuthCache>(USE_AUTH_QUERY_KEY, payload);
  };

  const onUseLoginMutationError = (error: Error) => {
    Alert.alert("Log in error", error.message);
  };

  return useMutation({
    mutationFn: login,
    onSuccess: onUseLoginMutationSuccess,
    onError: onUseLoginMutationError,
  });
};

// //sign up mutation
// export const useSignupMutation = () => {
//   const queryClient = useQueryClient();
//   const { saveAuthState } = useGlobalStore();

//   //save user id to global store and update auth query with user data
//   const onUseSignupMutationSuccess = (payload: ApiResponse<User>) => {
//     queryClient.setQueryData<AuthCache>(USE_AUTH_QUERY_KEY, payload);
//     saveAuthState(payload.data.id);
//     router.replace("/(tabs)/home");
//   };

//   const onUseSignupMutationError = (error: Error) => {
//     Alert.alert("Sign up error", error.message);
//   };

//   return useMutation({
//     mutationFn: signup,
//     onSuccess: onUseSignupMutationSuccess,
//     onError: onUseSignupMutationError,
//   });
// };

// //reset password mutation
// export const useResetPasswordMutation = () => {
//   const onUseResetPasswordMutationError = (error: Error) => {
//     Alert.alert("Reset password error: ", error.message);
//   };

//   return useMutation({
//     mutationFn: resetPassword,
//     onError: onUseResetPasswordMutationError,
//   });
// };

// //verify OTP mutation
// export const useVerifyOTPMutation = () => {
//   const onUseVerifyOTPMutationError = (error: Error) => {
//     Alert.alert("Verify OTP error", error.message);
//   };

//   return useMutation({
//     mutationFn: resetPassword,
//     onError: onUseVerifyOTPMutationError,
//   });
// };
