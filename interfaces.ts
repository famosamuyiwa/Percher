import { DateValues } from "date-fns/types";
import {
  BookingStatus,
  Category,
  ChargeType,
  Facility,
  LoginProvider,
  NotificationStatus,
  NotificationType,
  PaymentStatus,
  PerchTypes,
  RegistrationStatus,
  ReviewAction,
  Roles,
  TransactionMode,
  TransactionType,
  UserType,
} from "./constants/enums";

export interface BaseEntity {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Property extends BaseEntity {
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

export interface BookingFormData {
  periodOfStay: string;
  arrivalDate: Date;
  departureDate: Date;
  checkInTime: string;
  checkOutTime: string;
  periodInDigits: number;
}

export interface FormProps<T, S> {
  data: T;
  staticData?: S;
  onSubmit: (formData: T) => void;
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

export interface WalletState {
  wallet: Wallet | undefined;
  saveWalletState: (wallet: Partial<Wallet>) => void;
  resetWalletState: () => void;
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

export interface Booking extends BaseEntity {
  startDate: Date;
  endDate: Date;
  checkIn: string;
  checkOut: string;
  chargeType: ChargeType;
  propertyId: number;
  hostId: number;
  property?: Property;
  invoice?: Invoice;
  host?: User;
  guest?: User;
  transactionRef: string;
  status?: BookingStatus;
}

export interface User extends BaseEntity {
  email: string;
  name: string;
  phone: string;
  password: string;
  avatar: string;
  referredBy: User;
  referredUsers: User[];
  referralCode?: string;
  wallet?: Wallet;
  role?: Roles;
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
  perchType?: PerchTypes;
  searchTerm?: string;
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
  payment?: Payment;
  [key: string]: any; // Allows dynamic keys
}

export interface Payment {
  wallet?: Wallet;
  amount?: number;
  type?: TransactionType;
  status?: PaymentStatus;
  reference: string;
  invoice?: Invoice;
  transactionType?: TransactionType;
}

export interface Wallet extends BaseEntity {
  user: User;
  balance: number;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  bankCode?: string;
  bankLogo?: string;
  payments?: Payment[];
  transactions?: Transaction[];
}

export interface ReviewBookingRequest {
  id: number;
  action: ReviewAction;
  from: UserType;
}

export interface ReviewPropertyRequest {
  id: number;
  action: ReviewAction;
}

export interface Transaction extends BaseEntity {
  payment?: Payment;
  wallet?: Wallet;
  amount: number;
  type: TransactionType;
  mode?: TransactionMode | null;
  description?: string;
}

export interface CreatePaymentRequest {
  amount: number;
  reference: string;
  transactionType: TransactionType;
}

export interface INotification<T> {
  id: number;
  user: number;
  type: NotificationType;
  status: NotificationStatus;
  title: string;
  message: string;
  data?: T;
  createdAt: Date;
  modifiedAt: Date;
}
