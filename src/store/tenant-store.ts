import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TenantTheme {
  primary_color?: string;
  font_family?: string;
}

interface TenantProfile {
  id: string;
  name: string;
  travel_name?: string;
  slug: string;
  logo_url?: string;
  theme?: TenantTheme;
}

interface TenantState {
  tenant: TenantProfile | null;
  hasHydrated: boolean;
  setTenant: (tenant: any) => void;
  clearTenant: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      tenant: null,
      hasHydrated: false,
      setTenant: (tenantData) => {
        if (!tenantData) return set({ tenant: null });
        const name = tenantData.travel_name || tenantData.name || '';
        set({
          tenant: {
            ...tenantData,
            name,
            travel_name: tenantData.travel_name || name,
          },
        });
      },
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

