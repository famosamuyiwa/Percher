import { ApiResponse, Booking, Property, User } from "@/interfaces";

export type AuthCache = ApiResponse<User>; // You can extend this with more response interfaces if needed
export type PropertiesCache = ApiResponse<Property[]>;
export type FeaturedPropertiesCache = ApiResponse<Property[]>;
export type explorePropertiesCache = ApiResponse<Property[]>;
export type OwnedPropertiesCache = ApiResponse<Property[]>;
export type PropertyCache = ApiResponse<Property>;
export type BookingCache = ApiResponse<Booking>;
