export enum Facility {
  LAUNDRY = "Laundry",
  GARAGE = "Garage",
  GYM = "Gym",
  WIFI = "WiFi",
  FURNISHED = "Furnished",
  PET_FRIENDLY = "Pet Friendly",
  ESTATE_SECURITY = "Estate Security",
  POOL = "Pool",
  ELECTRICITY_24_7 = "24/7 Electricity",
  CCTV = "CCTV",
}

export enum Modal {
  CONFIRMATION = "CONFIRMATION",
  PAYMENT = "PAYMENT",
  RECEIPT = "RECEIPT",
  BOOKING = "BOOKING",
}

export enum UserType {
  HOST = "Host",
  GUEST = "Guest",
  ADMIN = "Admin",
}

export enum FilterCategoryKey {
  PERCHTYPE = "PerchType",
  BOOKINGS = "Bookings",
}

export enum PerchTypes {
  APARTMENT = "Apartment", // Serviced or not
  HOUSE = "House",
  VILLA = "Villa",
  MANSION = "Mansion",
  PENTHOUSE = "Penthouse",
  SELF_CONTAINED = "Self-Contained",
  BOYS_QUARTERS = "Boys' Quarters",
  OFFICE_SPACE = "Office Space",
  WAREHOUSE = "Warehouse",
  EVENT_CENTER = "Event Center",
  OTHERS = "Others",
}

export enum ChargeType {
  NIGHTLY = "Nightly",
}

export enum CheckInTime {
  _12AM = "12:00 AM",
  _1AM = "1:00 AM",
  _2AM = "2:00 AM",
  _3AM = "3:00 AM",
  _4AM = "4:00 AM",
  _5AM = "5:00 AM",
  _6AM = "6:00 AM",
  _7AM = "7:00 AM",
  _8AM = "8:00 AM",
  _9AM = "9:00 AM",
  _10AM = "10:00 AM",
  _11AM = "11:00 AM",
  _12PM = "12:00 PM",
  _1PM = "1:00 PM",
  _2PM = "2:00 PM",
  _3PM = "3:00 PM",
  _4PM = "4:00 PM",
  _5PM = "5:00 PM",
  _6PM = "6:00 PM",
  _7PM = "7:00 PM",
  _8PM = "8:00 PM",
  _9PM = "9:00 PM",
  _10PM = "10:00 PM",
  _11PM = "11:00 PM",
}

export enum CheckOutTime {
  _12PM = "12:00 PM",
  _1PM = "1:00 PM",
  _2PM = "2:00 PM",
  _3PM = "3:00 PM",
  _4PM = "4:00 PM",
  _5PM = "5:00 PM",
  _6PM = "6:00 PM",
  _7PM = "7:00 PM",
  _8PM = "8:00 PM",
  _9PM = "9:00 PM",
  _10PM = "10:00 PM",
  _11PM = "11:00 PM",
}

export enum LoginProvider {
  GOOGLE = "google",
  APPLE = "apple",
  MAIL = "mail",
}

export enum Screens {
  LOGIN_1 = "LOGIN_1",
  OAUTH = "OAUTH",
  SIGNUP_1 = "SIGNUP_1",
  SIGNUP_2 = "SIGNUP_2",
  OTP = "OTP",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
  RESET_PASSWORD = "RESET_PASSWORD",
  NOTIFICATIONS = "NOTIFICATIONS",
  MY_PERCHS = "MY_PERCHS",
  PAYMENTS = "PAYMENTS",
  APPEARANCE = "APPEARANCE",
  SECURITY = "SECURITY",
  HELP = "HELP",
  REFERRALS = "REFERRALS",
  EYE_BALLING = "EYE_BALLING",
}

export enum ToastType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
}

export enum Category {
  FEATURED = "Featured",
  RECOMMENDATION = "Recommendation",
}

export enum RegistrationStatus {
  IN_REVIEW = "In Review",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export enum BookingStatus {
  CURRENT = "Current",
  UPCOMING = "Upcoming",
  PENDING = "Pending",
  COMPLETED = "Completed",
  REJECTED = "Rejected",
  CANCELLED = "Cancelled",
  DRAFT = "Draft",
}

export enum PropertyScreenMode {
  VIEW_ONLY = "VIEW_ONLY",
  EYE_BALLING = "EYE_BALLING",
}

export enum TransactionStatus {
  PENDING = "Pending",
  COMPLETED = "Completed",
  FAILED = "Failed",
}

export enum TransactionType {
  DEPOSIT = "Deposit",
  WITHDRAWAL = "Withdrawal",
  BOOKING = "Booking",
  REFUND = "Booking Refund",
  CAUTION_FEE_CASHBACK = "Caution Fee Cashback",
  OTHER = "Other",
}

export enum PaymentStatus {
  SUCCESS = "success",
}

export enum ReviewAction {
  APPROVE = "Approve",
  REJECT = "Reject",
  CANCEL = "Cancel",
}

export enum TransactionMode {
  DEBIT = "Debit",
  CREDIT = "Credit",
}

export enum NotificationType {
  BOOKING_REQUEST = "Booking Request",
  BOOKING_APPROVED = "Booking Approved",
  BOOKING_REJECTED = "Booking Rejected",
  PAYMENT_SUCCESS = "Payment Success",
  PAYMENT_FAILED = "Payment Failed",
  REFUND = "Refund",
  SYSTEM = "System",
}

export enum NotificationStatus {
  UNREAD = "Unread",
  READ = "Read",
}

export const WEBSOCKET_DISCONNECT_REASON = {
  AUTHENTICATION_FAILED: "authentication_failed",
  CONNECTION_ERROR: "connection_error",
  TOKEN_REFRESH_FAILED: "token_refresh_failed",
  TOKEN_REFRESH_ERROR: "token_refresh_error",
  NORMAL_DISCONNECT: "normal_disconnect",
};

export enum GalleryType {
  PROOF_OF_IDENTITY = "proofOfIdentity",
  PROOF_OF_OWNERSHIP = "proofOfOwnership",
  GALLERY = "gallery",
}

export enum Roles {
  USER = "Role_User",
  ADMIN = "Role_Admin",
}

export enum MapMode {
  DEFAULT = "DEFAULT",
  PROPERTY_REGISTRATION = "PROPERTY_REGISTRATION",
}
