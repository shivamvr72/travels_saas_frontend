'use client';

import { useEffect, ReactNode } from 'react';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { useUiStore } from '@/store/ui-store';
import { useTenantStore } from '@/store/tenant-store';
import { apiClient } from '@/shared/lib/axios';
import { cn } from '@/shared/lib/utils';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppTopNav } from '@/components/layout/app-top-nav';
import { AppCommandPalette } from '@/components/layout/app-command-palette';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isSidebarOpen } = useUiStore();
  const { setTenant } = useTenantStore();

  useEffect(() => {
    apiClient
      .get('/api/v1/my-company')
      .then((res) => {
        if (res.data) {
          setTenant(res.data);
        }
      })
      .catch(() => {
        // Silent catch if user lacks permissions or offline
      });
  }, [setTenant]);

  return (
    <AuthGuard>
      {/* Outer wrapper: fixed full-screen shell, no overflow */}
      <div className="flex h-screen overflow-hidden bg-muted/40">
        <AppSidebar />

        {/* Right column: fixed height, no scrolling on the outer layout */}
        <div
          className={cn(
            "flex flex-1 flex-col min-w-0 transition-all duration-300 ease-in-out h-full",
            isSidebarOpen ? "md:pl-64" : "md:pl-16"
          )}
        >
          {/* Top nav — fixed at the top */}
          <AppTopNav />

          {/* Main content area — fills remaining space and contains its own scrollable sections */}
          <main className="flex-1 flex flex-col min-h-0 w-full overflow-y-auto overflow-x-hidden">
            <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 flex-1 flex flex-col min-h-0">
              {children}
            </div>
          </main>
        </div>

        <AppCommandPalette />
      </div>
    </AuthGuard>
  );
}
