import React from 'react';
import { PERIOD_PRESETS } from '../../domain/reports-constants';
import { ReportDateFilter } from '../../domain/reports-types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface ReportDateFilterProps {
  value: ReportDateFilter;
  onChange: (value: ReportDateFilter) => void;
}

export function ReportDateFilterComponent({ value, onChange }: ReportDateFilterProps) {
  const isCustom = value.period === 'custom';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap gap-1 rounded-md border p-1 bg-muted/20">
        {PERIOD_PRESETS.filter(p => p.value !== 'custom').map((preset) => (
          <Button
            key={preset.value}
            variant={value.period === preset.value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onChange({ period: preset.value })}
            className="h-8"
          >
            {preset.label}
          </Button>
        ))}
        <Button
          variant={isCustom ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onChange({ period: 'custom' })}
          className="h-8"
        >
          Custom
        </Button>
      </div>

      {isCustom && (
        <div className="flex items-center gap-2 ml-2">
          <Popover>
            {/* @ts-expect-error type compatibility issue */}
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-2">
                <CalendarIcon className="h-4 w-4" />
                {value.start_date ? format(new Date(value.start_date), 'PPP') : 'Start Date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value.start_date ? new Date(value.start_date) : undefined}
                onSelect={(d: Date | undefined) => onChange({ ...value, start_date: d?.toISOString() })}
              />
            </PopoverContent>
          </Popover>
          <span className="text-muted-foreground">-</span>
          <Popover>
            {/* @ts-expect-error type compatibility issue */}
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-2">
                <CalendarIcon className="h-4 w-4" />
                {value.end_date ? format(new Date(value.end_date), 'PPP') : 'End Date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value.end_date ? new Date(value.end_date) : undefined}
                onSelect={(d: Date | undefined) => onChange({ ...value, end_date: d?.toISOString() })}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
