import { AdminUserType } from "@/types/admin-user";
import { create } from "zustand";

interface AuthState {
  user: AdminUserType | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (user: AdminUserType, accessToken: string) => void;
  setUser: (user: AdminUserType) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  accessToken: null,
  login: (user, accessToken) =>
    set({ user, accessToken, isAuthenticated: true }),
  setUser: (user) => set({ user, isAuthenticated: true }),
  setAccessToken: (accessToken) =>
    set((state) => ({
      ...state,
      accessToken,
      isAuthenticated: true,
    })),
  logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
}));
