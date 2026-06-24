'use client';

import { ReactNode } from 'react';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { useUiStore } from '@/store/ui-store';
import { cn } from '@/shared/lib/utils';
import { Menu, LogOut, Settings, User } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

function Sidebar() {
  const { isSidebarOpen } = useUiStore();
  
  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-transform bg-card border-r",
        isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:w-20 md:translate-x-0"
      )}
    >
      <div className="flex h-16 items-center justify-center border-b px-4">
        <span className={cn("font-bold text-lg", !isSidebarOpen && "md:hidden")}>SVR Travels</span>
        {!isSidebarOpen && <span className="hidden md:block font-bold text-lg">SVR</span>}
      </div>
      <div className="py-4 px-3">
        {/* Navigation links will go here in FE-2 */}
        <div className="text-sm text-muted-foreground p-2">Navigation Placeholder</div>
      </div>
    </aside>
  );
}

function TopNav() {
  const { toggleSidebar } = useUiStore();
  const { user, logout } = useAuthStore();
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <button 
        onClick={toggleSidebar}
        className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      >
        <Menu className="h-5 w-5" />
      </button>
      
      <div className="flex-1">
        {/* Breadcrumbs will go here in FE-2 */}
        <span className="text-sm font-medium">Dashboard</span>
      </div>
      
      <div className="flex items-center gap-4">
        {/* User Menu Placeholder */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium">{user?.full_name || 'Operator'}</span>
            <span className="text-xs text-muted-foreground capitalize">{user?.role || 'User'}</span>
          </div>
          <button onClick={logout} className="p-2 hover:bg-accent rounded-full" title="Logout">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isSidebarOpen } = useUiStore();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-muted/40">
        <Sidebar />
        <div className={cn("flex flex-col transition-all", isSidebarOpen ? "md:ml-64" : "md:ml-20")}>
          <TopNav />
          <main className="flex-1 p-4 sm:p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
