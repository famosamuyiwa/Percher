import { DateValues } from "date-fns/types";
import {
  Category,
  Facility,
  LoginProvider,
  PerchTypes,
  PropertyType,
  RegistrationStatus,
  UserType,
} from "./constants/enums";

export interface Property {
  id: number;
  name: string;
  bed: number;
  bathroom: number;
  facilities: Facility[];
  type: string;
  description: string;
  location: string;
  price: number;
  cautionFee: number;
  header: string;
  gallery?: [];
  chargeType: string;
  checkInPeriods?: [];
  checkOutPeriod?: string;
  status: RegistrationStatus;
  proofOfIdentity: [];
  proofOfOwnership: [];
  termsAndConditions: boolean;
  rating: number;
  host?: User;
  category: Category;
  reviews?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Booking {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
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

export interface BookingState {
  property: Property | undefined;
  booking: Booking | undefined;
  saveBookingState: (booking: Partial<Property>) => void;
  resetBookingState: () => void;
}

export interface Booking {
  startDate: Date;
  endDate: Date;
  checkIn: string;
  checkOut: string;
}

export interface User {
  id: number;
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

export interface Filter {
  location: string;
  type: PerchTypes | null;
  limit: number;
  category: Category | null;
  from: UserType;
}
