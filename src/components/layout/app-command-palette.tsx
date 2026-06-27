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
  CommandShortcut,
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
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-500 mr-2">
              <FilePlus2 className="h-3.5 w-3.5" />
            </div>
            <span>Create Trip</span>
            <CommandShortcut>⌘T</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/expenses/add'))}>
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-500 mr-2">
              <Receipt className="h-3.5 w-3.5" />
            </div>
            <span>Add Expense</span>
            <CommandShortcut>⌘E</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/payments/receive'))}>
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 mr-2">
              <Banknote className="h-3.5 w-3.5" />
            </div>
            <span>Receive Payment</span>
            <CommandShortcut>⌘R</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/external-hiring/new'))}>
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-500 mr-2">
              <Bus className="h-3.5 w-3.5" />
            </div>
            <span>Hire Vehicle</span>
            <CommandShortcut>⌘H</CommandShortcut>
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
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-muted-foreground mr-2 group-data-selected/command-item:bg-background group-data-selected/command-item:text-foreground">
                    <item.icon className="h-3.5 w-3.5" />
                  </div>
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
