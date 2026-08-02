'use client';

import { useUiStore } from '@/store/ui-store';
import { cn } from '@/shared/lib/utils';
import { NAVIGATION_CONFIG } from '@/shared/config/navigation';
import { useAuthStore } from '@/store/auth-store';
import { canView } from '@/shared/permissions';
import { Building2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useTenantStore } from '@/store/tenant-store';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { useState, useEffect } from 'react';

function SidebarContent() {
  const { user } = useAuthStore();
  const { tenant } = useTenantStore();
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen } = useUiStore();

  if (!user) return null;

  return (
    <>
      <div className={cn(
        "flex h-16 items-center border-b shrink-0 transition-all duration-300 overflow-hidden",
        !isSidebarOpen ? "px-0 justify-center" : "px-6"
      )}>
        <Link 
          href="/dashboard" 
          className={cn(
            "flex items-center overflow-hidden w-full transition-all duration-300",
            !isSidebarOpen ? "justify-center" : "gap-2"
          )}
        >
          <Building2 className="h-6 w-6 shrink-0 text-primary" />
          <span className={cn(
            "font-bold text-lg whitespace-nowrap transition-all duration-300",
            !isSidebarOpen ? "opacity-0 md:hidden" : "opacity-100"
          )}>
            {tenant?.name || tenant?.travel_name || 'SVR Travels'}
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 no-scrollbar">
        {NAVIGATION_CONFIG.map((group, groupIdx) => {
          // Filter items based on RBAC
          const visibleItems = group.items.filter(
            (item) => !item.module || canView(item.module, user.role)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.group} className={cn("mb-6 px-3", groupIdx > 0 && "mt-6")}>
              <h3 className={cn(
                "mb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 transition-all duration-300",
                !isSidebarOpen ? "opacity-0 md:opacity-0 hidden md:block md:invisible" : "opacity-100"
              )}>
                {group.group}
              </h3>
              
              {/* Fallback for collapsed state group divider */}
              {!isSidebarOpen && groupIdx > 0 && (
                <div className="hidden md:block mx-4 my-2 border-t border-border" />
              )}

              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "group flex items-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-foreground relative",
                        isActive ? "bg-primary/5 text-primary" : "text-muted-foreground",
                      )}
                      title={!isSidebarOpen ? item.title : undefined}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                        <item.icon className={cn(
                          "h-5 w-5", 
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                        )} />
                      </div>
                      
                      <span className={cn(
                        "whitespace-nowrap transition-all duration-300 flex-1 flex justify-between items-center overflow-hidden pr-3",
                        !isSidebarOpen ? "opacity-0 md:opacity-0 md:w-0" : "opacity-100 w-auto"
                      )}>
                        {item.title}
                        {item.badge !== undefined && (
                          <Badge variant="secondary" className="px-1.5 py-0 min-w-5 justify-center">
                            {item.badge}
                          </Badge>
                        )}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className={cn(
        "p-4 border-t transition-all duration-300",
        !isSidebarOpen ? "md:p-2 md:flex md:justify-center" : ""
      )}>
        <Link 
          href="/profile"
          className={cn(
            "flex items-center gap-3 rounded-lg hover:bg-muted p-2 transition-colors",
            !isSidebarOpen ? "md:justify-center" : ""
          )}
        >
          <Avatar className="h-9 w-9 shrink-0 border border-border">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user.full_name?.substring(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className={cn(
            "flex flex-col overflow-hidden transition-all duration-300",
            !isSidebarOpen ? "opacity-0 md:opacity-0 md:hidden" : "opacity-100"
          )}>
            <span className="text-sm font-medium leading-none truncate">{user.full_name || 'User'}</span>
            <span className="text-xs text-muted-foreground mt-1 truncate capitalize">{user.role || 'Admin'}</span>
          </div>
        </Link>
      </div>
    </>
  );
}

export function AppSidebar() {
  const { isSidebarOpen, setSidebarOpen } = useUiStore();
  const [isMounted, setIsMounted] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {isMounted && !isDesktop && (
        <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-72 p-0 flex flex-col md:hidden bg-sidebar border-r border-border/50">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop Fixed Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col bg-sidebar border-r border-border/50 transition-all duration-300 ease-in-out md:flex",
          isSidebarOpen ? "w-64" : "w-16"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
