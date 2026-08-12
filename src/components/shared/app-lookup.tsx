'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LookupRegistry } from '@/shared/config/lookup-registry';
import { CacheProfiles } from '@/shared/lib/query-factory';
import { useDebounce } from '@/shared/hooks';
import { Check, ChevronsUpDown, Loader2, Plus } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { apiClient } from '@/shared/lib/axios';

interface AppLookupProps {
  /** The key from LookupRegistry */
  lookupKey: string;
  /** Currently selected value(s) */
  value?: string | string[];
  /** Callback when selection changes */
  onChange?: (value: string | string[] | null) => void;
  /** Callback with the full selected record object (for single select only) */
  onSelectRecord?: (record: any) => void;
  /** Whether multiple items can be selected */
  multiple?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Is the field disabled */
  disabled?: boolean;
  /** Whether to allow creating new items */
  allowCreate?: boolean;
  /** Callback when create is triggered */
  onCreate?: (search: string) => void;
}

export function AppLookup({
  lookupKey,
  value,
  onChange,
  onSelectRecord,
  multiple = false,
  placeholder = 'Select option...',
  disabled = false,
  allowCreate = false,
  onCreate,
}: AppLookupProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const config = LookupRegistry[lookupKey];

  // Fetch data
  const { data, isLoading } = useQuery({
    queryKey: ['lookup', lookupKey, debouncedSearch],
    queryFn: async () => {
      if (!config) return [];
      const searchParams = new URLSearchParams();
      if (debouncedSearch) {
        searchParams.set('search', debouncedSearch);
      }
      searchParams.set('page_size', '50');

      const separator = config.endpoint.includes('?') ? '&' : '?';
      const res = await apiClient.get(`${config.endpoint}${separator}${searchParams.toString()}`);
      // Backend PaginatedResponse uses { data: [...], total, page, page_size, total_pages }
      // Some endpoints (like dispatch available endpoints) might return a direct array
      if (Array.isArray(res.data)) {
        return res.data;
      }
      const payload = res.data as { data?: Record<string, unknown>[]; items?: Record<string, unknown>[] };
      return payload.data ?? payload.items ?? [];
    },
    staleTime: config?.staleTime || CacheProfiles.Lookup.staleTime,
    gcTime: CacheProfiles.Lookup.gcTime,
    enabled: !!config,
  });

  if (!config) {
    console.error(`Lookup key "${lookupKey}" not found in LookupRegistry`);
    return <div className="text-sm text-destructive">Invalid Lookup Config</div>;
  }

  const items = (data as Record<string, unknown>[] | undefined) ?? [];

  // Format selected values as an array for easier logic
  const selectedValues = Array.isArray(value) ? value : (value ? [value] : []);

  const handleSelect = (currentValue: string) => {
    const record = items.find(i => i[config.valueField || 'id'] === currentValue);
    if (multiple) {
      if (selectedValues.includes(currentValue)) {
        onChange?.(selectedValues.filter((v) => v !== currentValue));
      } else {
        onChange?.([...selectedValues, currentValue]);
      }
    } else {
      const isSelected = currentValue === value;
      onChange?.(isSelected ? null : currentValue);
      onSelectRecord?.(isSelected ? null : record);
      setOpen(false);
    }
  };

  const getDisplayLabel = (val: string) => {
    const item = items.find(i => i[config.valueField || 'id'] === val);
    if (!item) return val;
    if (config.formatDisplay) return config.formatDisplay(item);
    return String(item[config.displayField]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between font-normal"
        />
      }>
          {selectedValues.length > 0 ? (
            multiple ? (
              <div className="flex flex-wrap gap-1">
                {selectedValues.length} selected
              </div>
            ) : (
              <span className="truncate">{getDisplayLabel(selectedValues[0])}</span>
            )
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${lookupKey}...`}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading && (
              <div className="p-4 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
              </div>
            )}

            {!isLoading && items.length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}

            {!isLoading && items.length > 0 && (
              <CommandGroup>
                {items.map((item) => {
                  const itemValue = String(item[config.valueField || 'id']);
                  const itemDisplay = config.formatDisplay ? config.formatDisplay(item) : String(item[config.displayField]);
                  const isSelected = selectedValues.includes(itemValue);

                  return (
                    <CommandItem
                      key={itemValue}
                      value={itemValue}
                      onSelect={() => handleSelect(itemValue)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {itemDisplay}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}

            {!isLoading && allowCreate && search.trim() !== '' && !items.some(item => (config.formatDisplay ? config.formatDisplay(item) : String(item[config.displayField])).toLowerCase() === search.toLowerCase()) && (
              <CommandGroup>
                <CommandItem
                  value={search}
                  onSelect={() => {
                    if (onCreate) {
                      onCreate(search);
                      setOpen(false);
                      setSearch('');
                    }
                  }}
                  className="text-blue-600 dark:text-blue-400 font-medium cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create "{search}"
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
