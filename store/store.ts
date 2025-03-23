import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "./mmkv";
import { createAuthSlice } from "./slices/authSlice";
import { createBookingSlice } from "./slices/bookingSlice";
import { AuthState, BookingState } from "@/interfaces";

type StoreState = AuthState & BookingState; // You can extend this with more slices if needed

// Parent Store combining all slices
export const useGlobalStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...createAuthSlice(set, get),
      ...createBookingSlice(set, get),
    }),
    {
      name: "local-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
