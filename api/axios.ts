import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

let API_BASE_URL: string;
if (Platform.OS === "android") {
  // Use 10.0.2.2 for accessing localhost on Android emulatorr
  API_BASE_URL = "http://10.0.2.2:3000"; // Replace with your actual port number
} else {
  API_BASE_URL = "http://localhost:3000"; // Replace with your actual port number
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Function to get tokens
async function getStoredTokens() {
  const accessToken = await SecureStore.getItemAsync("accessToken");
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  return { accessToken, refreshToken };
}

// Add Authorization header to requests
api.interceptors.request.use(async (config) => {
  const { accessToken } = await getStoredTokens();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Handle expired access token
api.interceptors.response.use(
  (response) => response, // Return response if no error
  async (error) => {
    if (error.response?.status === 401) {
      console.log("Access token expired, refreshing...");
      return handleRefreshToken(error);
    }
    return Promise.reject(error);
  }
);

// Refresh token logic
export async function handleRefreshToken(error: any) {
  try {
    const { refreshToken } = await getStoredTokens();
    if (!refreshToken) throw new Error("No refresh token available");

    // Request a new access token
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });

    const newAccessToken = response.data.accessToken;
    const newRefreshToken = response.data.refreshToken;

    // Save new tokens
    await SecureStore.setItemAsync("accessToken", newAccessToken);
    await SecureStore.setItemAsync("refreshToken", newRefreshToken);

    // Retry original request with new token
    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
    return api.request(error.config);
  } catch (refreshError) {
    console.log("Refresh token failed:", refreshError);
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    return Promise.reject(refreshError);
  }
}

export default api;
