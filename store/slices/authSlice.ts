import { AuthState } from "@/interfaces";
import { resetAuthState, saveAuthState } from "../utils";

export const createAuthSlice = (set: any, get: any): AuthState => ({
  jwt: "",
  saveAuthState: (jwt: string) => set(() => saveAuthState(jwt)),
  resetAuthState: () => set(() => resetAuthState()),
});
