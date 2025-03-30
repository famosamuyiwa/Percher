import { Wallet, WalletState } from "@/interfaces";
import { resetWalletState, saveWalletState } from "../utils";

export const createWalletSlice = (set: any, get: any): WalletState => ({
  wallet: undefined,
  saveWalletState: (wallet: Partial<Wallet>) =>
    set((state: WalletState) => saveWalletState(state, wallet)),
  resetWalletState: () => set(() => resetWalletState()),
});
