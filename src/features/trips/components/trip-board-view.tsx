'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trip, TripStatus, TripPriority } from '../domain/trip-types';
import { tripNumberService } from '../services/trip-number.service';
import { useTripLifecycle } from '../hooks/use-trip-lifecycle';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  Car,
  User,
  MapPin,
  ArrowRight,
  ExternalLink,
  Search,
  Filter,
  Send,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TripBoardViewProps {
  trips: Trip[];
  isLoading?: boolean;
}

interface ColumnConfig {
  id: string;
  title: string;
  statuses: TripStatus[];
  color: string;
  borderColor: string;
  headerBg: string;
  badgeClass: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'draft',
    title: 'Draft / Planned',
    statuses: ['draft'],
    color: '#94a3b8',
    borderColor: 'border-t-slate-400',
    headerBg: 'bg-slate-500/5',
    badgeClass: 'bg-slate-500/15 text-slate-300',
  },
  {
    id: 'assigned',
    title: 'Assigned',
    statuses: ['assigned'],
    color: '#3b82f6',
    borderColor: 'border-t-blue-500',
    headerBg: 'bg-blue-500/5',
    badgeClass: 'bg-blue-500/15 text-blue-300',
  },
  {
    id: 'dispatched',
    title: 'Dispatched',
    statuses: ['dispatched'],
    color: '#f59e0b',
    borderColor: 'border-t-amber-500',
    headerBg: 'bg-amber-500/5',
    badgeClass: 'bg-amber-500/15 text-amber-300',
  },
  {
    id: 'started',
    title: 'Running',
    statuses: ['started'],
    color: '#10b981',
    borderColor: 'border-t-emerald-500',
    headerBg: 'bg-emerald-500/5',
    badgeClass: 'bg-emerald-500/15 text-emerald-300',
  },
  {
    id: 'completed',
    title: 'Completed',
    statuses: ['completed'],
    color: '#6366f1',
    borderColor: 'border-t-indigo-500',
    headerBg: 'bg-indigo-500/5',
    badgeClass: 'bg-indigo-500/15 text-indigo-300',
  },
  {
    id: 'closed',
    title: 'Settled / Closed',
    statuses: ['settled', 'cancelled'],
    color: '#64748b',
    borderColor: 'border-t-zinc-500',
    headerBg: 'bg-zinc-500/5',
    badgeClass: 'bg-zinc-500/15 text-zinc-300',
  },
];

const PRIORITY_STYLES: Record<string, { border: string; bg: string; text: string }> = {
  Urgent: { border: 'border-l-rose-500', bg: 'bg-rose-500/10', text: 'text-rose-400' },
  High: { border: 'border-l-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  Normal: { border: 'border-l-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  Low: { border: 'border-l-slate-400', bg: 'bg-slate-500/10', text: 'text-slate-400' },
};

/**
 * Compact, high-density Trip Board Card with direct action triggers.
 */
function TripBoardCard({ trip }: { trip: Trip }) {
  const router = useRouter();
  const { execute, isPending } = useTripLifecycle(trip);

  const priorityConf = PRIORITY_STYLES[trip.priority] || PRIORITY_STYLES.Normal;

  const formattedDate = useMemo(() => {
    if (!trip.start_date) return 'Unscheduled';
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(trip.start_date)) {
        const [year, month, day] = trip.start_date.split('-').map(Number);
        return format(new Date(year, month - 1, day), 'MMM d');
      }
      return format(new Date(trip.start_date), 'MMM d');
    } catch {
      return trip.start_date;
    }
  }, [trip.start_date]);

  const handleAction = async (e: React.MouseEvent, target: TripStatus) => {
    e.stopPropagation();
    await execute(target);
  };

  return (
    <Card
      onClick={() => router.push(`/trips/${trip.id}`)}
      className={cn(
        'group relative cursor-pointer border hover:border-primary/50 hover:shadow-md transition-all duration-200 bg-card/70 backdrop-blur-xs p-2.5 rounded-lg border-l-4 space-y-2 select-none',
        priorityConf.border
      )}
    >
      {/* Header: ID + Priority badge */}
      <div className="flex items-center justify-between gap-1.5">
        <Link
          href={`/trips/${trip.id}`}
          onClick={(e) => e.stopPropagation()}
          className="font-mono text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          {tripNumberService.format(trip.trip_number)}
          <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        <span
          className={cn(
            'text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wider',
            priorityConf.bg,
            priorityConf.text
          )}
        >
          {trip.priority}
        </span>
      </div>

      {/* Customer Name */}
      <div className="text-xs font-medium text-foreground truncate" title={trip.customer?.name || ''}>
        {trip.customer?.name || <span className="text-muted-foreground text-xs italic">No Customer</span>}
      </div>

      {/* Route Badge */}
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/40 px-2 py-1 rounded truncate">
        <MapPin className="h-3 w-3 text-primary shrink-0" />
        <span className="truncate font-medium text-foreground">
          {trip.route?.from_location || trip.origin || 'Origin'}
        </span>
        <ArrowRight className="h-2.5 w-2.5 shrink-0 text-muted-foreground/60" />
        <span className="truncate font-medium text-foreground">
          {trip.route?.to_location || trip.destination || 'Destination'}
        </span>
      </div>

      {/* Footer: Resources + Quick Action */}
      <div className="pt-1 border-t flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
        {/* Resources or Date */}
        <div className="flex items-center gap-2 truncate min-w-0">
          <div className="flex items-center gap-1 shrink-0" title={`Date: ${formattedDate}`}>
            <Calendar className="h-3 w-3 text-muted-foreground/70" />
            <span className="text-[10px] font-medium">{formattedDate}</span>
          </div>

          {trip.vehicle?.license_plate && (
            <div className="flex items-center gap-1 truncate" title={trip.vehicle.license_plate}>
              <Car className="h-3 w-3 text-muted-foreground/70 shrink-0" />
              <span className="truncate text-[10px] font-mono">{trip.vehicle.license_plate}</span>
            </div>
          )}
        </div>

        {/* 1-Click Action Button */}
        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
          {trip.status === 'assigned' && (
            <Button
              size="xs"
              variant="default"
              disabled={isPending}
              onClick={(e) => handleAction(e, 'dispatched')}
              className="h-6 text-[10.5px] px-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded shadow-xs"
            >
              <Send className="h-2.5 w-2.5 mr-1" />
              Dispatch
            </Button>
          )}

          {trip.status === 'dispatched' && (
            <Button
              size="xs"
              variant="default"
              disabled={isPending}
              onClick={(e) => handleAction(e, 'started')}
              className="h-6 text-[10.5px] px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded shadow-xs"
            >
              <Play className="h-2.5 w-2.5 mr-1" />
              Start
            </Button>
          )}

          {trip.status === 'started' && (
            <Button
              size="xs"
              variant="default"
              disabled={isPending}
              onClick={(e) => handleAction(e, 'completed')}
              className="h-6 text-[10.5px] px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded shadow-xs"
            >
              <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
              Complete
            </Button>
          )}

          {trip.status === 'draft' && (
            <Button
              size="xs"
              variant="outline"
              onClick={() => router.push(`/trips/${trip.id}/edit`)}
              className="h-6 text-[10.5px] px-2 font-medium rounded"
            >
              Assign
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export function TripBoardView({ trips, isLoading }: TripBoardViewProps) {
  const [boardSearch, setBoardSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Filter trips locally within the board for instantaneous search feedback
  const filteredTrips = useMemo(() => {
    return trips.filter((t) => {
      // Priority filter
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) {
        return false;
      }
      // Search filter
      if (boardSearch.trim()) {
        const query = boardSearch.toLowerCase();
        const tripNum = (t.trip_number || '').toLowerCase();
        const custName = (t.customer?.name || '').toLowerCase();
        const origin = (t.route?.from_location || t.origin || '').toLowerCase();
        const dest = (t.route?.to_location || t.destination || '').toLowerCase();
        const veh = (t.vehicle?.license_plate || '').toLowerCase();
        const driver = (t.driver?.name || '').toLowerCase();

        return (
          tripNum.includes(query) ||
          custName.includes(query) ||
          origin.includes(query) ||
          dest.includes(query) ||
          veh.includes(query) ||
          driver.includes(query)
        );
      }
      return true;
    });
  }, [trips, boardSearch, priorityFilter]);

  const getTripsForColumn = (statuses: TripStatus[]) => {
    return filteredTrips.filter((t) => statuses.includes(t.status));
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3">
      {/* Board Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-card border rounded-xl shadow-xs shrink-0">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Filter board by ID, customer, route, vehicle..."
              value={boardSearch}
              onChange={(e) => setBoardSearch(e.target.value)}
              className="h-8 pl-8 text-xs bg-background"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Priority filter buttons */}
          <div className="inline-flex rounded-lg border bg-muted/30 p-0.5 text-xs">
            {['all', 'Urgent', 'High', 'Normal'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriorityFilter(p)}
                className={cn(
                  'px-2.5 py-1 text-xs font-medium rounded-md transition-all',
                  priorityFilter === p
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {p === 'all' ? 'All' : p}
              </button>
            ))}
          </div>

          <Badge variant="secondary" className="font-mono text-xs px-2.5 py-1">
            {filteredTrips.length} {filteredTrips.length === 1 ? 'Trip' : 'Trips'}
          </Badge>
        </div>
      </div>

      {/* Columns Board Container */}
      <div className="flex-1 min-h-0 overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-max h-full">
          {COLUMNS.map((column) => {
            const columnTrips = getTripsForColumn(column.statuses);

            return (
              <div
                key={column.id}
                className={cn(
                  'w-[270px] min-w-[270px] flex flex-col rounded-xl bg-card border shadow-xs border-t-2',
                  column.borderColor
                )}
              >
                {/* Column Header */}
                <div
                  className={cn(
                    'p-2.5 border-b flex items-center justify-between gap-2 shrink-0 rounded-t-lg',
                    column.headerBg
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: column.color }}
                    />
                    <h3 className="font-semibold text-xs tracking-tight">
                      {column.title}
                    </h3>
                  </div>

                  <Badge
                    variant="secondary"
                    className={cn('font-mono text-[10.5px] px-1.5 py-0.5 font-bold', column.badgeClass)}
                  >
                    {columnTrips.length}
                  </Badge>
                </div>

                {/* Column Scrollable Body */}
                <div className="flex-1 p-2.5 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)]">
                  {isLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-24 rounded-lg bg-muted/40 animate-pulse border"
                        />
                      ))}
                    </div>
                  ) : columnTrips.length === 0 ? (
                    <div className="h-28 flex flex-col items-center justify-center text-xs text-muted-foreground/60 border border-dashed rounded-lg p-3 text-center">
                      <p>No trips</p>
                    </div>
                  ) : (
                    columnTrips.map((trip) => (
                      <TripBoardCard key={trip.id} trip={trip} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
