import { FilterCategoryKey, PerchTypes, Facility } from "./enums";
import icons from "./icons";

export const filterCategories = [
  { title: "All", category: "All", key: FilterCategoryKey.PERCHTYPE },
  {
    title: PerchTypes.APARTMENT,
    category: PerchTypes.APARTMENT,
    key: FilterCategoryKey.PERCHTYPE,
  },
  {
    title: PerchTypes.HOUSE,
    category: PerchTypes.HOUSE,
    key: FilterCategoryKey.PERCHTYPE,
  },
  {
    title: PerchTypes.VILLA,
    category: PerchTypes.VILLA,
    key: FilterCategoryKey.PERCHTYPE,
  },
  {
    title: PerchTypes.MANSION,
    category: PerchTypes.MANSION,
    key: FilterCategoryKey.PERCHTYPE,
  },
  {
    title: PerchTypes.PENTHOUSE,
    category: PerchTypes.PENTHOUSE,
    key: FilterCategoryKey.PERCHTYPE,
  },
  {
    title: PerchTypes.SELF_CONTAINED,
    category: PerchTypes.SELF_CONTAINED,
    key: FilterCategoryKey.PERCHTYPE,
  },
  {
    title: PerchTypes.BOYS_QUARTERS,
    category: PerchTypes.BOYS_QUARTERS,
    key: FilterCategoryKey.PERCHTYPE,
  },
  {
    title: PerchTypes.OFFICE_SPACE,
    category: PerchTypes.OFFICE_SPACE,
    key: FilterCategoryKey.PERCHTYPE,
  },
  {
    title: PerchTypes.WAREHOUSE,
    category: PerchTypes.WAREHOUSE,
    key: FilterCategoryKey.PERCHTYPE,
  },
  {
    title: PerchTypes.EVENT_CENTER,
    category: PerchTypes.EVENT_CENTER,
    key: FilterCategoryKey.PERCHTYPE,
  },
  {
    title: PerchTypes.OTHERS,
    category: PerchTypes.OTHERS,
    key: FilterCategoryKey.PERCHTYPE,
  },
  { title: "Current", category: "Current", key: FilterCategoryKey.BOOKINGS },
  { title: "Upcoming", category: "Upcoming", key: FilterCategoryKey.BOOKINGS },
  { title: "Pending", category: "Pending", key: FilterCategoryKey.BOOKINGS },
  {
    title: "Completed",
    category: "Completed",
    key: FilterCategoryKey.BOOKINGS,
  },
  { title: "Rejected", category: "Rejected", key: FilterCategoryKey.BOOKINGS },
  {
    title: "Cancelled",
    category: "Cancelled",
    key: FilterCategoryKey.BOOKINGS,
  },
];

export const facilities = [
  {
    title: Facility.LAUNDRY,
    icon: "shirt",
  },
  {
    title: Facility.GARAGE,
    icon: "car",
  },
  {
    title: Facility.GYM,
    icon: "barbell",
  },
  {
    title: Facility.POOL,
    icon: "water",
  },
  {
    title: Facility.WIFI,
    icon: "wifi",
  },
  {
    title: Facility.ELECTRICITY_24_7,
    icon: "bulb",
  },
  {
    title: Facility.CCTV,
    icon: "videocam-sharp",
  },
  {
    title: Facility.PET_FRIENDLY,
    icon: "paw",
  },
  {
    title: Facility.FURNISHED,
    icon: "tv",
  },
  {
    title: Facility.ESTATE_SECURITY,
    icon: "shield-checkmark",
  },
];
