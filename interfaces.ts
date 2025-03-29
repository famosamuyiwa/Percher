import { DateValues } from "date-fns/types";
import {
  BookingStatus,
  Category,
  ChargeType,
  Facility,
  LoginProvider,
  PaymentStatus,
  PerchTypes,
  RegistrationStatus,
  ReviewAction,
  TransactionType,
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
  saveBookingState: (
    property: Partial<Property> | undefined,
    booking: Partial<Booking> | undefined
  ) => void;
  resetBookingState: () => void;
}

export interface Booking {
  id: number;
  startDate: Date;
  endDate: Date;
  checkIn: string;
  checkOut: string;
  chargeType: ChargeType;
  propertyId: number;
  hostId: number;
  createdAt?: Date;
  updatedAt?: Date;
  property?: Property;
  invoice?: Invoice;
  host?: User;
  guest?: User;
  transactionRef: string;
  status?: BookingStatus;
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
  location?: string;
  type?: PerchTypes;
  limit?: number;
  category?: Category;
  from?: UserType;
  bookingStatus?: BookingStatus;
}

export interface Invoice {
  price: number;
  subPrice: number;
  period: number;
  subTotal: number;
  guestServiceFee: number;
  hostServiceFee: number;
  cautionFee: number;
  guestTotal?: number;
  hostTotal?: number;
  booking?: Booking;
  payments?: Payment[];
  [key: string]: any; // Allows dynamic keys
}

export interface Payment {
  wallet?: Wallet;
  amount?: number;
  type?: TransactionType;
  status?: PaymentStatus;
  reference: string;
  invoice?: Invoice;
}

export interface Wallet {
  user: User;
  balance: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  payments: Payment[];
}

export interface ReviewBookingRequest {
  id: number;
  action: ReviewAction;
}
