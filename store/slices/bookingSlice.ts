import { BookingState, Property } from "@/interfaces";
import { resetBookingState, saveAuthState, saveBookingState } from "../utils";

export const createBookingSlice = (set: any, get: any): BookingState => ({
  property: undefined,
  booking: undefined,
  saveBookingState: (property: Partial<Property>) =>
    set((state: BookingState) => saveBookingState(state, property)),
  resetBookingState: () => set(() => resetBookingState()),
});
