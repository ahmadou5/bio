import { create } from "zustand";

interface AuthStore {
  isAuthenticate: boolean;
  setAuthenticate: (isAuthenticate: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticate: false,
  setAuthenticate: (isAuthenticate) => set({ isAuthenticate }),
}));
