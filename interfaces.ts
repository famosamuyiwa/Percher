import { Models } from "react-native-appwrite";
import { Facility, PropertyType } from "./constants/enums";

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
  checkOutTimes: string[];
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
