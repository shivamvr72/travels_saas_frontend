import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TenantTheme {
  primary_color?: string;
  font_family?: string;
}

interface TenantProfile {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  theme?: TenantTheme;
}

interface TenantState {
  tenant: TenantProfile | null;
  hasHydrated: boolean;
  setTenant: (tenant: TenantProfile) => void;
  clearTenant: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      tenant: null,
      hasHydrated: false,
      setTenant: (tenant) => set({ tenant }),
      clearTenant: () => set({ tenant: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'tenant-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

