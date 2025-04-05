import { Platform } from "react-native";

export const GUEST_SERVICE_FEE_PERCENTAGE = Number(
  process.env.EXPO_PUBLIC_GUEST_SERVICE_FEE_PERCENTAGE!
);

export const HOST_SERVICE_FEE_PERCENTAGE = Number(
  process.env.EXPO_PUBLIC_HOST_SERVICE_FEE_PERCENTAGE!
);

export const WITHDRAWAL_FEE_PERCENTAGE = Number(
  process.env.EXPO_PUBLIC_WITHDRAWAL_FEE_PERCENTAGE!
);

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  (Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : "http://localhost:3000");

export const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_KEY!;
