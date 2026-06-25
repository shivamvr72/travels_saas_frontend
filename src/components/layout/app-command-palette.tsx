'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { NAVIGATION_CONFIG } from '@/shared/config/navigation';
import { useUiStore } from '@/store/ui-store';
import { useAuthStore } from '@/store/auth-store';
import { canView } from '@/shared/permissions';
import { FilePlus2, Receipt, Banknote, Bus } from 'lucide-react';

export function AppCommandPalette() {
  const router = useRouter();
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useUiStore();
  const { user } = useAuthStore();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  const runCommand = React.useCallback(
    (command: () => void) => {
      setCommandPaletteOpen(false);
      command();
    },
    [setCommandPaletteOpen]
  );

  if (!user) return null;

  return (
    <CommandDialog open={isCommandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => router.push('/trips/create'))}>
            <FilePlus2 className="mr-2 h-4 w-4" />
            <span>Create Trip</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/expenses/add'))}>
            <Receipt className="mr-2 h-4 w-4" />
            <span>Add Expense</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/payments/receive'))}>
            <Banknote className="mr-2 h-4 w-4" />
            <span>Receive Payment</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/external-hiring/new'))}>
            <Bus className="mr-2 h-4 w-4" />
            <span>Hire Vehicle</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {NAVIGATION_CONFIG.map((group) => {
          // Check if user can see at least one item in the group
          const visibleItems = group.items.filter(
            (item) => !item.module || canView(item.module, user.role)
          );

          if (visibleItems.length === 0) return null;

          return (
            <CommandGroup key={group.group} heading={group.group}>
              {visibleItems.map((item) => (
                <CommandItem
                  key={item.href}
                  value={item.title}
                  onSelect={() => runCommand(() => router.push(item.href))}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
