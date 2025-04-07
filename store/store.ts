import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "./mmkv";
import { createAuthSlice } from "./slices/authSlice";
import { createBookingSlice } from "./slices/bookingSlice";
import { AuthState, BookingState, WalletState } from "@/interfaces";
import { createWalletSlice } from "./slices/walletSlice";
import { UploadState, createUploadSlice } from "./slices/uploadSlice";

type StoreState = AuthState & BookingState & WalletState & UploadState;

// Parent Store combining all slices
export const useGlobalStore = create<StoreState>()(
  persist(
    (set, get, store) => ({
      ...createAuthSlice(set, get),
      ...createBookingSlice(set, get),
      ...createWalletSlice(set, get),
      ...createUploadSlice(set, get, store),
    }),
    {
      name: "local-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
