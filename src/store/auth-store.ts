import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { queryClient } from '@/shared/lib/query-client';

type Role = 'admin' | 'manager' | 'viewer';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  role: Role;
  travel_company_id: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;
  setAuth: (accessToken: string, refreshToken: string, user: UserProfile) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: UserProfile) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: true, // true initially until hydration/refresh check
      hasHydrated: false,
      setAuth: (accessToken, refreshToken, user) =>
        set({ accessToken, refreshToken, user, isAuthenticated: true, isLoading: false }),
      setAccessToken: (accessToken) => set({ accessToken, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        // Clear TanStack Query Cache on logout to prevent data leakage
        queryClient.clear();
      },
      setLoading: (isLoading) => set({ isLoading }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'auth-storage',
      // Only persist the refresh token (and maybe user) to localStorage for security
      partialize: (state) => ({ refreshToken: state.refreshToken, user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

// Optional: Global storage event listener to handle cross-tab logout
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'auth-storage') {
      const newValue = event.newValue;
      if (!newValue || !JSON.parse(newValue).state?.refreshToken) {
        useAuthStore.getState().logout();
      }
    }
  });
}

