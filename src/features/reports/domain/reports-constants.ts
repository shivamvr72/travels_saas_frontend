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
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#6366f1', // Indigo
  '#84cc16', // Lime
  '#06b6d4', // Cyan
  '#d946ef', // Fuchsia
  '#eab308', // Yellow
  '#64748b', // Slate
  '#a855f7', // Purple
];

export const EXPENSE_COLOR_MAP: Record<string, string> = {
  fuel: 'hsl(var(--chart-1))',
  maintenance: 'hsl(var(--chart-2))',
  toll: 'hsl(var(--chart-3))',
  parking: 'hsl(var(--chart-4))',
  driver_allowance: 'hsl(var(--chart-5))',
  other: 'hsl(var(--muted-foreground))',
};
