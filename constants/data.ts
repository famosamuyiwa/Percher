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
  { title: "All", category: "All", key: FilterCategoryKey.BOOKINGS },
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

export const propertyCoordinates = [
  { id: 1, lat: 6.5244, long: 3.3792 },
  { id: 2, lat: 6.5281, long: 3.3754 },
  { id: 3, lat: 6.5157, long: 3.3951 },
  { id: 4, lat: 6.5402, long: 3.3629 },
  { id: 5, lat: 6.4987, long: 3.3824 },
  { id: 6, lat: 6.5341, long: 3.4053 },
  { id: 7, lat: 6.5105, long: 3.3611 },
  { id: 8, lat: 6.5566, long: 3.3919 },
  { id: 9, lat: 6.52, long: 3.3502 },
  { id: 10, lat: 6.5077, long: 3.3998 },
];
