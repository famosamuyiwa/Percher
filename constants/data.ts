import { CategoryKey } from "./enums";
import icons from "./icons";
import images from "./images";

export const categories = [
  { title: "All", category: "All", key: CategoryKey.PERCHTYPE },
  { title: "Houses", category: "House", key: CategoryKey.PERCHTYPE },
  { title: "Condos", category: "Condos", key: CategoryKey.PERCHTYPE },
  { title: "Duplexes", category: "Duplexes", key: CategoryKey.PERCHTYPE },
  { title: "Studios", category: "Studios", key: CategoryKey.PERCHTYPE },
  { title: "Villas", category: "Villa", key: CategoryKey.PERCHTYPE },
  { title: "Apartments", category: "Apartments", key: CategoryKey.PERCHTYPE },
  { title: "Townhomes", category: "Townhomes", key: CategoryKey.PERCHTYPE },
  { title: "Others", category: "Others", key: CategoryKey.PERCHTYPE },
  { title: "Current", category: "Current", key: CategoryKey.BOOKINGS },
  { title: "Upcoming", category: "Upcoming", key: CategoryKey.BOOKINGS },
  { title: "Pending", category: "Pending", key: CategoryKey.BOOKINGS },
  { title: "Completed", category: "Completed", key: CategoryKey.BOOKINGS },
  { title: "Rejected", category: "Rejected", key: CategoryKey.BOOKINGS },
  { title: "Cancelled", category: "Cancelled", key: CategoryKey.BOOKINGS },
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

export const gallery = [
  {
    id: 1,
    image: images.newYork,
  },
  {
    id: 2,
    image: images.japan,
  },
  {
    id: 3,
    image: images.newYork,
  },
  {
    id: 4,
    image: images.japan,
  },
  {
    id: 5,
    image: images.newYork,
  },
  {
    id: 6,
    image: images.japan,
  },
];
