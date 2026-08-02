'use client';

import { useUiStore } from '@/store/ui-store';
import { Menu, Search, Bell } from 'lucide-react';
import { AppBreadcrumb } from './app-breadcrumb';
import { AppUserMenu } from './app-user-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTenantStore } from '@/store/tenant-store';

export function AppTopNav() {
  const { toggleSidebar, setCommandPaletteOpen } = useUiStore();
  const { tenant } = useTenantStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground shrink-0"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        <AppBreadcrumb />
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 sm:justify-between sm:gap-4 ml-auto">
        <div className="flex-1 sm:flex-initial sm:px-4 ml-auto hidden sm:block">
          <Button
            variant="outline"
            className="relative h-9 w-full justify-start rounded-lg bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-64 lg:w-80"
            onClick={() => setCommandPaletteOpen(true)}
          >
            <span className="hidden lg:inline-flex">Search anything...</span>
            <span className="inline-flex lg:hidden">Search...</span>
            <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>
        
        {/* Mobile search button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="sm:hidden shrink-0"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>

        <div className="flex items-center gap-2">
          {(tenant?.name || tenant?.travel_name) && (
            <Badge variant="secondary" className="hidden md:inline-flex mr-2">
              {tenant.name || tenant.travel_name}
            </Badge>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="shrink-0 relative mr-1"
            onClick={() => {
              import('sonner').then(m => m.toast.info('No new notifications'));
            }}
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
            <span className="sr-only">Notifications</span>
          </Button>
          
          <AppUserMenu />
        </div>
      </div>
    </header>
  );
}
