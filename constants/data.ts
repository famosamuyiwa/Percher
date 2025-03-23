import { FilterCategoryKey } from "./enums";
import icons from "./icons";

export const filterCategories = [
  { title: "All", category: "All", key: FilterCategoryKey.PERCHTYPE },
  { title: "Houses", category: "House", key: FilterCategoryKey.PERCHTYPE },
  { title: "Condos", category: "Condos", key: FilterCategoryKey.PERCHTYPE },
  { title: "Duplexes", category: "Duplexes", key: FilterCategoryKey.PERCHTYPE },
  { title: "Studios", category: "Studios", key: FilterCategoryKey.PERCHTYPE },
  { title: "Villas", category: "Villa", key: FilterCategoryKey.PERCHTYPE },
  {
    title: "Apartments",
    category: "Apartments",
    key: FilterCategoryKey.PERCHTYPE,
  },
  {
    title: "Townhomes",
    category: "Townhomes",
    key: FilterCategoryKey.PERCHTYPE,
  },
  { title: "Others", category: "Others", key: FilterCategoryKey.PERCHTYPE },
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
    title: "Laundry",
    icon: "shirt",
  },
  {
    title: "Garage",
    icon: "car",
  },
  {
    title: "Gym",
    icon: "barbell",
  },
  {
    title: "Swimming pool",
    icon: icons.swim,
  },
  {
    title: "Wifi",
    icon: "wifi",
  },
];
