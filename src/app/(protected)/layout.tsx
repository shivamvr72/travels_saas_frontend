'use client';

import { ReactNode } from 'react';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { useUiStore } from '@/store/ui-store';
import { cn } from '@/shared/lib/utils';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppTopNav } from '@/components/layout/app-top-nav';
import { AppCommandPalette } from '@/components/layout/app-command-palette';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isSidebarOpen } = useUiStore();

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-muted/40">
        <AppSidebar />
        
        <div 
          className={cn(
            "flex flex-1 flex-col transition-all duration-300 ease-in-out w-full",
            isSidebarOpen ? "md:pl-64" : "md:pl-16"
          )}
        >
          <AppTopNav />
          <main className="flex-1 p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto">
            {children}
          </main>
        </div>
        
        <AppCommandPalette />
      </div>
    </AuthGuard>
  );
}
