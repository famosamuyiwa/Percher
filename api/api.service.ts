import { config, getJwtToken } from "@/lib/appwrite";
import { handleApiError } from "@/utils/common";
import axios from "axios";
import { Platform } from "react-native";

// let API_BASE_URL = Constants?.expoConfig?.extra?.apiBaseUrl;
// // let API_BASE_URL = "https://tabbie-backend-service.onrender.com";

let API_BASE_URL: string;
const PAYSTACK_SECRET_KEY = process.env.EXPO_PUBLIC_PAYSTACK_TEST_SECRET_KEY!;

if (Platform.OS === "android") {
  // Use 10.0.2.2 for accessing localhost on Android emulatorr
  API_BASE_URL = "http://10.0.2.2:3000"; // Replace with your actual port number
} else {
  API_BASE_URL = "http://localhost:3000"; // Replace with your actual port number
}

// export const login = async (credentials: LoginRequest) => {
//   try {
//     const { data: payload } = await axios.post(`${API_BASE_URL}/auth/login`, {
//       ...credentials,
//     });
//     return payload;
//   } catch (error: any) {
//     handleApiError(error);
//   }
// };

// export const loginWithOAuth = async (credentials: OAuthRequest) => {
//   console.log("BASE_URL: ", API_BASE_URL);
//   try {
//     const { data: payload } = await axios.post(`${API_BASE_URL}/auth/oauth`, {
//       ...credentials,
//     });
//     return payload;
//   } catch (error: any) {
//     handleApiError(error);
//   }
// };

// export const OAuthFirstTimeLogin = async (
//   credentials: OAuthFirstTimeRequest
// ) => {
//   try {
//     const { data: payload } = await axios.put(
//       `${API_BASE_URL}/auth/oauth/update`,
//       {
//         ...credentials,
//       }
//     );
//     return payload;
//   } catch (error: any) {
//     handleApiError(error);
//   }
// };

// export const signup = async (credentials: SignupRequest) => {
//   try {
//     const { data: payload } = await axios.post(
//       `${API_BASE_URL}/auth/register`,
//       {
//         ...credentials,
//       }
//     );
//     return payload;
//   } catch (error: any) {
//     handleApiError(error);
//   }
// };

// export const resetPassword = async (credentials: ResetPasswordRequest) => {
//   try {
//     const { data: payload } = await axios.post(
//       `${API_BASE_URL}/auth/reset-password`,
//       {
//         ...credentials,
//       }
//     );
//     return payload;
//   } catch (error: any) {
//     handleApiError(error);
//   }
// };

// export const verifyUserByEmail = async (email: string) => {
//   try {
//     const { data: payload } = await axios.get(`${API_BASE_URL}/auth/check`, {
//       params: {
//         by: QueryBy.EMAIL,
//         value: email,
//       },
//     });
//     return payload;
//   } catch (error: any) {
//     handleApiError(error);
//   }
// };

// export const verifyOTPByEmail = async (email: string, otp: string) => {
//   try {
//     const { data: payload } = await axios.get(
//       `${API_BASE_URL}/otp/verify/${otp}`,
//       {
//         params: { email },
//       }
//     );
//     return payload;
//   } catch (error: any) {
//     handleApiError(error);
//   }
// };

// export const getUserById = async (userId: number) => {
//   try {
//     const { data: payload } = await axios.get(`${API_BASE_URL}/user/${userId}`);
//     return payload;
//   } catch (error: any) {
//     handleApiError(error);
//   }
// };

// export const getFriendsByUserId = async (
//   userId: number,
//   pageParam: number | null = null
// ) => {
//   try {
//     const { data: payload } = await axios.get(
//       `${API_BASE_URL}/user/friends/${userId}`,
//       {
//         params: {
//           limit: 12,
//           cursor: pageParam,
//         },
//       }
//     );
//     return payload;
//   } catch (error: any) {
//     handleApiError(error);
//   }
// };

// export const updateFriendsByUserId = async (
//   credentials: UpdateFriendsRequest
// ) => {
//   const { userId, friendId, action } = credentials;
//   try {
//     const { data: payload } = await axios.post(
//       `${API_BASE_URL}/user/friends/${userId}/${friendId}?action=${action}`
//     );
//     return payload;
//   } catch (error: any) {
//     handleApiError(error);
//   }
// };

// export const searchFriendsByName = async (
//   credentials: SearchFriendsRequest
// ) => {
//   const { userId, searchTerm } = credentials;
//   try {
//     const { data: payload } = await axios.get(
//       `${API_BASE_URL}/user/friends/${userId}/search`,
//       {
//         params: {
//           searchTerm,
//         },
//       }
//     );
//     return payload;
//   } catch (error: any) {
//     handleApiError(error);
//   }
// };

// export const searchUsersByName = async (credentials: SearchFriendsRequest) => {
//   const { userId, searchTerm } = credentials;
//   try {
//     const { data: payload } = await axios.get(
//       `${API_BASE_URL}/user/${userId}/search`,
//       {
//         params: {
//           searchTerm,
//         },
//       }
//     );
//     return payload;
//   } catch (error: any) {
//     handleApiError(error);
//   }
// };

// export const createSplit = async (credentials: CreateSplit) => {
//   try {
//     const { data: payload } = await axios.post(`${API_BASE_URL}/split`, {
//       ...credentials,
//     });
//     return payload;
//   } catch (error: any) {
//     handleApiError(error);
//   }
// };

// export const getSplitsByUserId = async (
//   userId: number,
//   pageParam: number | null = null,
//   status: SplitStatus | null = null,
//   limit: number = 12
// ) => {
//   try {
//     const { data: payload } = await axios.get(
//       `${API_BASE_URL}/split/${userId}`,
//       {
//         params: {
//           limit,
//           cursor: pageParam,
//           status,
//         },
//       }
//     );
//     return payload;
//   } catch (error: any) {
//     handleApiError(error);
//   }
// };

// export const markExpensesAsPaid = async (credentials: markAsPaid) => {
//   try {
//     const { data: payload } = await axios.post(
//       `${API_BASE_URL}/expense/mark-paid/${credentials.memberType}`,
//       { ...credentials }
//     );
//     return payload;
//   } catch (error: any) {
//     handleApiError(error);
//   }
// };

// export const updateUser = async (credentials: Partial<User>) => {
//   const { id } = credentials;
//   delete credentials.id;
//   try {
//     const { data: payload } = await axios.put(`${API_BASE_URL}/user/${id}`, {
//       ...credentials,
//     });
//     return payload;
//   } catch (error: any) {
//     handleApiError(error);
//   }
// };

export const fetchBanksFromPaystack = async () => {
  try {
    const response = await axios.get(
      "https://api.paystack.co/bank?currency=NGN&supports_transfer=true&active=true",
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const verifyAccountNumberFromPaystack = async (
  accountNumber: number,
  bankCode: number
) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// export const getSessionUser = async () => {
//   // const token = await getJwtToken();
//   try {
//     const response = await axios.get(`http://localhost:3000/appwrite`, {
//       headers: {
//         Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2N2MzOWRiMWQwZWJjMjYwY2U4OCIsInNlc3Npb25JZCI6IjY3Y2Y3Y2M3ZjIxNjk5YTBlZTYxIiwiZXhwIjoxNzQxNjUyMDYzfQ.CAuCP6CrXatwKzN7vE9YwSER3H-PWBx2VMtDcnLMCTE`,
//       },
//     });
//     return response;
//   } catch (error) {
//     console.log("error: ", error);
//     handleApiError(error);
//   }
// };

export const getSessionUser = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/appwrite`, {
      headers: {
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2N2MzOWRiMWQwZWJjMjYwY2U4OCIsInNlc3Npb25JZCI6IjY3Y2Y3Y2M3ZjIxNjk5YTBlZTYxIiwiZXhwIjoxNzQxNjUyMDYzfQ.CAuCP6CrXatwKzN7vE9YwSER3H-PWBx2VMtDcnLMCTE`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Add these options to help with CORS issues
      withCredentials: false,
      timeout: 10000,
    });
    return response;
  } catch (error: any) {
    console.log("error: ", error);
    // More detailed error logging
    if (error.response) {
      // Server responded with non-2xx code
      console.log("Response data:", error.response.data);
      console.log("Response status:", error.response.status);
    } else if (error.request) {
      // Request was made but no response received
      console.log("No response received:", error.request);
    }
    handleApiError(error);
  }
};
