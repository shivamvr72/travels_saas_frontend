'use client';

import React, { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ActionDef } from './app-toolbar';

interface AppRowActionsProps<T> {
  item: T;
  actions: ((item: T) => ActionDef[]) | ActionDef[];
}

export function AppRowActions<T>({ item, actions }: AppRowActionsProps<T>) {
  const [open, setOpen] = useState(false);

  const resolvedActions = typeof actions === 'function' ? actions(item) : actions;

  if (!resolvedActions || resolvedActions.length === 0) {
    return null;
  }

  // In the future, check RBAC permissions here
  const visibleActions = resolvedActions;

  if (visibleActions.length === 0) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      {/* @ts-expect-error asChild is valid but missing in strict types */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {visibleActions.map((action, idx) => {
          return (
            <DropdownMenuItem
              key={idx}
              onClick={(e) => {
                e.stopPropagation(); // prevent row click
                action.onClick();
                setOpen(false);
              }}
              className={action.variant === 'destructive' ? 'text-destructive focus:text-destructive' : ''}
              disabled={action.disabled}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
