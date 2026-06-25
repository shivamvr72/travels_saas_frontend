'use client';

import { AppSectionCard } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { FilePlus2, Receipt, Banknote, Bus } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { canCreate } from '@/shared/permissions';

export function DashboardQuickActions() {
  const { user } = useAuthStore();
  
  if (!user) return null;

  return (
    <TooltipProvider>
      <AppSectionCard title="Quick Actions">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Tooltip>
            <TooltipTrigger 
              render={
                <Button 
                  variant="outline" 
                  className="h-24 flex-col gap-2 bg-muted/50 hover:bg-muted"
                  disabled={!canCreate('TRIPS', user.role)}
                >
                  <FilePlus2 className="h-6 w-6 text-primary" />
                  <span>Create Trip</span>
                </Button>
              }
            />
            <TooltipContent>
              {canCreate('TRIPS', user.role) ? 'Coming in FE-3' : 'You do not have permission'}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger 
              render={
                <Button 
                  variant="outline" 
                  className="h-24 flex-col gap-2 bg-muted/50 hover:bg-muted"
                  disabled={!canCreate('FINANCE', user.role)}
                >
                  <Receipt className="h-6 w-6 text-primary" />
                  <span>Add Expense</span>
                </Button>
              }
            />
            <TooltipContent>
              {canCreate('FINANCE', user.role) ? 'Coming in FE-3' : 'You do not have permission'}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger 
              render={
                <Button 
                  variant="outline" 
                  className="h-24 flex-col gap-2 bg-muted/50 hover:bg-muted"
                  disabled={!canCreate('FINANCE', user.role)}
                >
                  <Banknote className="h-6 w-6 text-primary" />
                  <span>Receive Payment</span>
                </Button>
              }
            />
            <TooltipContent>
              {canCreate('FINANCE', user.role) ? 'Coming in FE-3' : 'You do not have permission'}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger 
              render={
                <Button 
                  variant="outline" 
                  className="h-24 flex-col gap-2 bg-muted/50 hover:bg-muted"
                  disabled={!canCreate('FINANCE', user.role)}
                >
                  <Bus className="h-6 w-6 text-primary" />
                  <span>Hire Vehicle</span>
                </Button>
              }
            />
            <TooltipContent>
              {canCreate('FINANCE', user.role) ? 'Coming in FE-3' : 'You do not have permission'}
            </TooltipContent>
          </Tooltip>
        </div>
      </AppSectionCard>
    </TooltipProvider>
  );
}
