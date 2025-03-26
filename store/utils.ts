import { Booking, BookingState, Property } from "@/interfaces";

export const saveAuthState = (jwt: string) => ({
  jwt,
});

export const resetAuthState = () => ({
  jwt: undefined,
  session: undefined,
  isAuthenticated: false,
});

export const saveBookingState = (
  state: BookingState,
  property: Partial<Property> | undefined,
  booking: Partial<Booking> | undefined
) => ({
  property: property
    ? { ...state.property, ...property }
    : { ...state.property },
  booking: booking ? { ...state.booking, ...booking } : { ...state.booking },
});

export const resetBookingState = () => ({
  property: undefined,
  booking: undefined,
});
