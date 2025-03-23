import { BookingState, Property } from "@/interfaces";

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
  property: Partial<Property>
) => ({
  property: { ...state.property, ...property },
});

export const resetBookingState = () => ({
  jwt: undefined,
  session: undefined,
  isAuthenticated: false,
});
