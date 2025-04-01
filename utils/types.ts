import {
  ApiResponse,
  Booking,
  INotification,
  Payment,
  Property,
  User,
  Wallet,
} from "@/interfaces";

export type AuthCache = ApiResponse<User>; // You can extend this with more response interfaces if needed
export type PropertiesCache = ApiResponse<Property[]>;
export type FeaturedPropertiesCache = ApiResponse<Property[]>;
export type explorePropertiesCache = ApiResponse<Property[]>;
export type OwnedPropertiesCache = ApiResponse<Property[]>;
export type PropertyCache = ApiResponse<Property>;
export type BookingsCache = ApiResponse<Booking[]>;
export type BookingCache = ApiResponse<Booking>;
export type WalletCache = ApiResponse<Wallet>;
export type NotificationsCache = ApiResponse<INotification<any>[]>;
