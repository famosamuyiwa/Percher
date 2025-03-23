import {
  Booking,
  Filter,
  OAuthRequest,
  PerchRegistrationFormData,
  ResetPasswordRequest,
  SignupRequest,
  User,
} from "@/interfaces";
import { getHeaders, handleApiError, saveJwt } from "@/utils/common";
import axios from "axios";
import { Platform } from "react-native";
import api from "./axios";
import * as SecureStore from "expo-secure-store";
import { signOut } from "@/hooks/useGoogleOAuth";

let API_BASE_URL: string;
const PAYSTACK_SECRET_KEY = process.env.EXPO_PUBLIC_PAYSTACK_TEST_SECRET_KEY!;

if (Platform.OS === "android") {
  // Use 10.0.2.2 for accessing localhost on Android emulatorr
  API_BASE_URL = "http://10.0.2.2:3000"; // Replace with your actual port number
} else {
  API_BASE_URL = "http://localhost:3000"; // Replace with your actual port number
}

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const { data: payload } = await api.post(`${API_BASE_URL}/auth/login`, {
      ...credentials,
    });
    const { accessToken, refreshToken } = payload.data;
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    return payload;
  } catch (error: any) {
    handleApiError(error);
  }
};

export const loginWithOAuth = async (credentials: OAuthRequest) => {
  try {
    const { data: payload } = await api.post(`${API_BASE_URL}/auth/oauth`, {
      ...credentials,
    });
    const { accessToken, refreshToken } = payload.data;

    // Store tokens
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);

    return payload;
  } catch (error: any) {
    handleApiError(error);
  }
};

export const logout = async () => {
  try {
    await signOut();
    const { data: payload } = await api.get(`${API_BASE_URL}/auth/logout`);
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    console.log("payload: ", payload);
    return payload;
  } catch (error: any) {
    handleApiError(error);
  }
};

export const signup = async (credentials: SignupRequest) => {
  try {
    const { data: payload } = await api.post(`${API_BASE_URL}/auth/register`, {
      ...credentials,
    });
    const { accessToken, refreshToken } = payload.data;

    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    return payload;
  } catch (error: any) {
    handleApiError(error);
  }
};

export const resetPassword = async (credentials: ResetPasswordRequest) => {
  try {
    const { data: payload } = await api.post(
      `${API_BASE_URL}/auth/reset-password`,
      {
        ...credentials,
      }
    );
    return payload;
  } catch (error: any) {
    handleApiError(error);
  }
};

export const verifyUserByEmail = async (email: string) => {
  try {
    const { data: payload } = await api.get(
      `${API_BASE_URL}/auth/check/${email}`
    );
    return payload;
  } catch (error: any) {
    handleApiError(error);
  }
};

export const verifyOTPByEmail = async (email: string, otp: string) => {
  try {
    const { data: payload } = await api.get(
      `${API_BASE_URL}/auth/verify/${otp}`,
      {
        params: { email },
      }
    );
    return payload;
  } catch (error: any) {
    handleApiError(error);
  }
};

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

export const createProperty = async (
  credentials: PerchRegistrationFormData
) => {
  try {
    const { data: payload } = await api.post(`${API_BASE_URL}/property`, {
      ...credentials,
    });
    return payload;
  } catch (error: any) {
    handleApiError(error);
  }
};

export const createBooking = async (credentials: Booking) => {
  try {
    const { data: payload } = await api.post(`${API_BASE_URL}/booking`, {
      ...credentials,
    });
    return payload;
  } catch (error: any) {
    handleApiError(error);
  }
};

export const getAllProperties = async (
  pageParam: number | null = null,
  filters: Filter
) => {
  try {
    const { data: payload } = await api.get(`${API_BASE_URL}/property`, {
      params: {
        cursor: pageParam,
        ...filters,
      },
    });
    return payload;
  } catch (error: any) {
    handleApiError(error);
  }
};

export const getPropertyById = async (id: number) => {
  try {
    const { data: payload } = await api.get(`${API_BASE_URL}/property/${id}`);
    return payload;
  } catch (error: any) {
    handleApiError(error);
  }
};

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

export const updateUser = async (credentials: Partial<User>) => {
  const { id } = credentials;
  delete credentials.id;
  try {
    const { data: payload } = await api.put(`${API_BASE_URL}/user/${id}`, {
      ...credentials,
    });
    return payload;
  } catch (error: any) {
    handleApiError(error);
  }
};

export const fetchBanksFromPaystack = async () => {
  try {
    const { data: payload } = await axios.get(
      "https://api.paystack.co/bank?currency=NGN&supports_transfer=true&active=true",
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return payload;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchBankFromNigerianBanksApi = async () => {
  try {
    const { data: payload } = await axios.get("https://nigerianbanks.xyz");

    return payload;
  } catch (error) {
    handleApiError(error);
  }
};

export const verifyAccountNumberFromPaystack = async (
  accountNumber: number,
  bankCode: number
) => {
  try {
    const { data: payload } = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    return payload;
  } catch (error) {
    handleApiError(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: payload } = await api.get(`${API_BASE_URL}/auth`);
    return payload;
  } catch (error) {
    handleApiError(error);
  }
};
