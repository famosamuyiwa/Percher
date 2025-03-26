import { Booking, BookingState, Property } from "@/interfaces";
import { resetBookingState, saveBookingState } from "../utils";

export const createBookingSlice = (set: any, get: any): BookingState => ({
  property: undefined,
  booking: undefined,
  saveBookingState: (
    property: Partial<Property> | undefined,
    booking: Partial<Booking> | undefined
  ) => set((state: BookingState) => saveBookingState(state, property, booking)),
  resetBookingState: () => set(() => resetBookingState()),
});
