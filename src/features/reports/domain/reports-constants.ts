import { PeriodPreset } from './reports-types';

export const PERIOD_PRESETS: { label: string; value: PeriodPreset }[] = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'This Week', value: 'this_week' },
  { label: 'Last Week', value: 'last_week' },
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
];

export const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export const EXPENSE_COLOR_MAP: Record<string, string> = {
  fuel: 'hsl(var(--chart-1))',
  maintenance: 'hsl(var(--chart-2))',
  toll: 'hsl(var(--chart-3))',
  parking: 'hsl(var(--chart-4))',
  driver_allowance: 'hsl(var(--chart-5))',
  other: 'hsl(var(--muted-foreground))',
};
