'use client';

import React, { useEffect } from 'react';
import { applyThemeColors } from '@/shared/lib/theme-utils';
import { useTenantStore } from '@/store/tenant-store';
import { apiClient } from '@/shared/lib/axios';

interface ThemeResponse {
  primary_color: string | null;
  secondary_color: string | null;
  font_family: string | null;
  logo_url: string | null;
  travel_name: string | null;
}

export function TenantThemeProvider({ children }: { children: React.ReactNode }) {
  const { tenant, setTenant } = useTenantStore();

  // 1. Immediately apply cached colors or existing tenant colors from store
  useEffect(() => {
    try {
      const cachedPrimary = localStorage.getItem('tenant_primary_color');
      const cachedSecondary = localStorage.getItem('tenant_secondary_color');

      if (tenant?.primary_color || cachedPrimary) {
        applyThemeColors(
          tenant?.primary_color || cachedPrimary,
          tenant?.secondary_color || cachedSecondary
        );
      }
    } catch {
      // Ignore localStorage errors (e.g. private mode)
    }
  }, [tenant?.primary_color, tenant?.secondary_color]);

  // 2. Fetch fresh company details from server
  useEffect(() => {
    async function loadTheme() {
      try {
        // Check if user is authenticated (token exists in localStorage or auth-storage)
        let hasAuth = false;
        try {
          const authStorage = localStorage.getItem('auth-storage');
          if (authStorage) {
            const parsed = JSON.parse(authStorage);
            if (parsed?.state?.accessToken) {
              hasAuth = true;
            }
          }
        } catch {}

        if (hasAuth) {
          // Authenticated: fetch latest tenant company data
          try {
            const { data } = await apiClient.get('/api/v1/my-company');
            if (data) {
              setTenant(data);
              applyThemeColors(data.primary_color, data.secondary_color);
              if (data.slug) localStorage.setItem('tenantSlug', data.slug);
              if (data.logo_url) localStorage.setItem('tenantLogo', data.logo_url);
              if (data.travel_name) {
                localStorage.setItem('tenantName', data.travel_name);
                document.title = `${data.travel_name} | SVR Travels SaaS`;
              }
              return;
            }
          } catch (err) {
            // If my-company fails, fall through to public theme endpoint
          }
        }

        // Public / unauthenticated: determine slug
        let slug = 'svr-travels'; // Reliable default tenant
        try {
          const cachedSlug = localStorage.getItem('tenantSlug');
          if (cachedSlug) {
            slug = cachedSlug;
          } else {
            const hostname = window.location.hostname;
            const parts = hostname.split('.');
            if (parts.length > 2 && hostname !== 'localhost' && hostname !== '127.0.0.1') {
              slug = parts[0];
            }
          }
        } catch {}

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const response = await fetch(`${apiUrl}/tenant/theme/${slug}`);
        if (!response.ok) {
          // Try fallback to svr-travels if custom slug failed
          if (slug !== 'svr-travels') {
            const fallbackResp = await fetch(`${apiUrl}/tenant/theme/svr-travels`);
            if (fallbackResp.ok) {
              const fallbackData: ThemeResponse = await fallbackResp.json();
              applyThemeColors(fallbackData.primary_color, fallbackData.secondary_color);
              if (fallbackData.logo_url) localStorage.setItem('tenantLogo', fallbackData.logo_url);
              if (fallbackData.travel_name) {
                localStorage.setItem('tenantName', fallbackData.travel_name);
                document.title = `${fallbackData.travel_name} | SVR Travels SaaS`;
              }
            }
          }
          return;
        }

        const themeData: ThemeResponse = await response.json();
        applyThemeColors(themeData.primary_color, themeData.secondary_color);

        if (themeData.font_family) {
          document.documentElement.style.setProperty('--font-inter', themeData.font_family);
        }
        if (themeData.logo_url) {
          localStorage.setItem('tenantLogo', themeData.logo_url);
        }
        if (themeData.travel_name) {
          localStorage.setItem('tenantName', themeData.travel_name);
          document.title = `${themeData.travel_name} | SVR Travels SaaS`;
        }
      } catch (error) {
        console.error('Failed to load tenant theme:', error);
      }
    }

    loadTheme();
  }, [setTenant]);

  return <>{children}</>;
}
