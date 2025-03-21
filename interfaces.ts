import { Models } from "react-native-appwrite";
import { Facility, LoginProvider, PropertyType } from "./constants/enums";

export interface Property extends Models.Document {
  description: string;
  address: string;
  price: number;
  name: string;
  bedrooms: string;
  bathrooms: string;
  rating: number;
  facilities: Facility;
  image: string;
  geolocation: string;
  agent: any;
  gallery: any;
  type: PropertyType;
  reviews: any;
  area: number;
}

export interface PerchRegistrationFormData {
  propertyName: string;
  propertyType: string;
  chargeType: string;
  beds: number;
  bathrooms: number;
  description: string;
  header: string;
  location: string;
  price: number;
  cautionFee: number;
  gallery: string[];
  proofOfOwnership: string[];
  proofOfIdentity: string[];
  txc: boolean;
  facilities: string[];
  checkInTimes: string[];
  checkOutTime: string;
}

export interface PerchRegistrationFormProps {
  data: PerchRegistrationFormData;
  onSubmit: (formData: PerchRegistrationFormData) => void;
}

export interface ApiResponse<T = any> {
  code: number;
  status: string;
  message: string;
  data: T;
  nextCursor?: number;
}

export interface AuthState {
  jwt?: string;
  sessionId: string;
  saveAuthState: (jwt: string) => void;
  resetAuthState: () => void;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  password: string;
  avatar: string;
  role: string;
  referredBy: User;
  referredUsers: User[];
  referralCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum ResponseStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export interface OAuthRequest {
  provider: LoginProvider;
  name: string;
  email: string;
}

export interface SignupRequest {
  email: string;
  name: string;
  password: string;
  referralCode?: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
}

export interface ToastProps {
  type?: "success" | "warning" | "error";
  description?: string;
  duration?: number;
}
