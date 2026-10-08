import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = {
  id?: string;
  email?: string;
  role?: string;
};

type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  registrationSuccess: boolean;
  user: AuthUser | null;
  setSession: (token: string, user?: AuthUser | null) => void;
  setRegistrationSuccess: (success: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      hasHydrated: false,
      registrationSuccess: false,
      user: null,
      setSession: (token, user = null) =>
        set({ token, isAuthenticated: true, user, registrationSuccess: false }),
      setRegistrationSuccess: (registrationSuccess) => set({ registrationSuccess }),
      logout: () => set({ token: null, isAuthenticated: false, user: null }),
    }),
    {
      name: "tramita-auth",
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hasHydrated: true });
      },
    },
  ),
);