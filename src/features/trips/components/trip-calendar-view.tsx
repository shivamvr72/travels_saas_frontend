'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trip, TripStatus } from '../domain/trip-types';
import { TripStatusBadge } from './trip-status-badge';
import { tripNumberService } from '../services/trip-number.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Car,
  User,
  MapPin,
  ArrowRight,
  ExternalLink,
  CalendarDays,
  Columns,
  Plus,
} from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from 'date-fns';
import { cn } from '@/lib/utils';

interface TripCalendarViewProps {
  trips: Trip[];
  isLoading?: boolean;
}

const STATUS_COLOR_MAP: Record<TripStatus | string, { bg: string; text: string; dot: string; border: string }> = {
  draft: {
    bg: 'bg-slate-500/15 hover:bg-slate-500/30',
    text: 'text-slate-300',
    dot: 'bg-slate-400',
    border: 'border-slate-500/30',
  },
  assigned: {
    bg: 'bg-blue-500/15 hover:bg-blue-500/30',
    text: 'text-blue-300',
    dot: 'bg-blue-400',
    border: 'border-blue-500/30',
  },
  dispatched: {
    bg: 'bg-amber-500/15 hover:bg-amber-500/30',
    text: 'text-amber-300',
    dot: 'bg-amber-400',
    border: 'border-amber-500/30',
  },
  started: {
    bg: 'bg-emerald-500/15 hover:bg-emerald-500/30',
    text: 'text-emerald-300',
    dot: 'bg-emerald-400',
    border: 'border-emerald-500/30',
  },
  completed: {
    bg: 'bg-indigo-500/15 hover:bg-indigo-500/30',
    text: 'text-indigo-300',
    dot: 'bg-indigo-400',
    border: 'border-indigo-500/30',
  },
  settled: {
    bg: 'bg-zinc-500/15 hover:bg-zinc-500/30',
    text: 'text-zinc-300',
    dot: 'bg-zinc-400',
    border: 'border-zinc-500/30',
  },
  cancelled: {
    bg: 'bg-rose-500/15 hover:bg-rose-500/30',
    text: 'text-rose-300',
    dot: 'bg-rose-400',
    border: 'border-rose-500/30',
  },
};

/**
 * Robust date parser: handles YYYY-MM-DD strings without UTC timezone drift.
 */
function parseTripDate(dateStr?: string | null): Date | null {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

function isSameDaySafe(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function TripCalendarView({ trips, isLoading }: TripCalendarViewProps) {
  const router = useRouter();
  const [calendarMode, setCalendarMode] = useState<'month' | 'week'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [dayDialogOpen, setDayDialogOpen] = useState(false);

  // Month intervals
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const monthDays = useMemo(() => {
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [monthStart, monthEnd]);

  const numWeeks = useMemo(() => {
    return Math.ceil(monthDays.length / 7);
  }, [monthDays]);

  // Week intervals
  const weekDays = useMemo(() => {
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  const handlePrev = () => {
    if (calendarMode === 'month') {
      setCurrentDate((prev) => subMonths(prev, 1));
    } else {
      setCurrentDate((prev) => subWeeks(prev, 1));
    }
  };

  const handleNext = () => {
    if (calendarMode === 'month') {
      setCurrentDate((prev) => addMonths(prev, 1));
    } else {
      setCurrentDate((prev) => addWeeks(prev, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getTripsForDay = (day: Date): Trip[] => {
    return trips.filter((t) => {
      const tripDate = parseTripDate(t.start_date);
      if (!tripDate) return false;
      return isSameDaySafe(tripDate, day);
    });
  };

  const selectedDayTrips = selectedDay ? getTripsForDay(selectedDay) : [];

  const activePeriodTripsCount = useMemo(() => {
    if (calendarMode === 'month') {
      return trips.filter((t) => {
        const tripDate = parseTripDate(t.start_date);
        return tripDate && isSameMonth(tripDate, currentDate);
      }).length;
    }
    const startW = startOfWeek(currentDate);
    const endW = endOfWeek(currentDate);
    return trips.filter((t) => {
      const tripDate = parseTripDate(t.start_date);
      return tripDate && tripDate >= startW && tripDate <= endW;
    }).length;
  }, [trips, currentDate, calendarMode]);

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3">
      {/* Calendar Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-card border rounded-xl shadow-xs shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="h-8 w-8"
            aria-label="Previous Period"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="h-8 w-8"
            aria-label="Next Period"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="h-8 text-xs font-medium px-3"
          >
            Today
          </Button>

          <h2 className="text-base font-semibold tracking-tight ml-2">
            {calendarMode === 'month'
              ? format(currentDate, 'MMMM yyyy')
              : `Week of ${format(startOfWeek(currentDate), 'MMM d')} – ${format(endOfWeek(currentDate), 'MMM d, yyyy')}`}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-xs px-2.5 py-1 font-medium">
            {activePeriodTripsCount} {activePeriodTripsCount === 1 ? 'Trip' : 'Trips'} in{' '}
            {calendarMode === 'month' ? format(currentDate, 'MMM') : 'this week'}
          </Badge>

          {/* Mode Switcher: Month / Week */}
          <div className="inline-flex rounded-lg border bg-muted/30 p-0.5">
            <button
              type="button"
              onClick={() => setCalendarMode('month')}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all',
                calendarMode === 'month'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              Month
            </button>
            <button
              type="button"
              onClick={() => setCalendarMode('week')}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all',
                calendarMode === 'week'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Columns className="h-3.5 w-3.5" />
              Week
            </button>
          </div>
        </div>
      </div>

      {/* MONTH VIEW */}
      {calendarMode === 'month' && (
        <div className="flex-1 min-h-0 bg-card border rounded-xl shadow-xs overflow-hidden flex flex-col">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b bg-muted/40 text-center text-xs font-semibold py-2 shrink-0">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, idx) => (
              <div
                key={dayName}
                className={cn(
                  'py-0.5',
                  idx === 0 || idx === 6 ? 'text-muted-foreground' : 'text-foreground'
                )}
              >
                {dayName}
              </div>
            ))}
          </div>

          {/* Days Matrix (CSS Grid with distinct cell borders and fixed row templates) */}
          <div
            className="grid grid-cols-7 flex-1 min-h-0 overflow-hidden"
            style={{
              gridTemplateRows: `repeat(${numWeeks}, minmax(0, 1fr))`,
            }}
          >
            {monthDays.map((day) => {
              const dayTrips = getTripsForDay(day);
              const inCurrentMonth = isSameMonth(day, currentDate);
              const isTodayDate = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'relative p-1.5 flex items-start gap-1.5 overflow-hidden border-b border-r border-border/40 transition-colors select-none group',
                    !inCurrentMonth && 'bg-muted/10 text-muted-foreground/30',
                    inCurrentMonth && 'bg-card'
                  )}
                >
                  {/* Left Column: Date Indicator & Counter Badge Below It */}
                  <div className="shrink-0 flex flex-col items-center gap-1 pt-0.5">
                    <span
                      className={cn(
                        'text-xs font-semibold flex items-center justify-center w-5 h-5 rounded-full transition-colors',
                        isTodayDate && 'bg-primary text-primary-foreground font-bold shadow-xs',
                        !isTodayDate && inCurrentMonth && 'text-foreground',
                        !inCurrentMonth && 'text-muted-foreground/30'
                      )}
                    >
                      {format(day, 'd')}
                    </span>

                    {/* Counter Badge moved directly below Date */}
                    {dayTrips.length > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDay(day);
                          setDayDialogOpen(true);
                        }}
                        className="text-[9.5px] font-mono font-bold px-1.5 py-0 rounded-full bg-primary/15 text-primary border border-primary/25 hover:bg-primary/25 transition-colors cursor-pointer"
                        title={`View all ${dayTrips.length} trips on ${format(day, 'MMM d')}`}
                      >
                        {dayTrips.length}
                      </button>
                    )}
                  </div>

                  {/* Right Area: Trips Content directly aligned to top */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1 overflow-hidden justify-start pt-0.5">
                    {/* If day is empty: subtle '+' on hover to schedule a trip */}
                    {dayTrips.length === 0 && inCurrentMonth && (
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/trips/new?start_date=${format(day, 'yyyy-MM-dd')}`);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer"
                          title={`Schedule a new trip on ${format(day, 'MMM d')}`}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    )}

                    {/* Trip Pills Content */}
                    {dayTrips.length === 1 && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/trips/${dayTrips[0].id}`);
                        }}
                        className={cn(
                          'px-1.5 py-0.5 rounded text-[10px] font-medium border truncate flex items-center gap-1 transition-all cursor-pointer shadow-2xs hover:brightness-125 hover:ring-1 hover:ring-primary/40',
                          STATUS_COLOR_MAP[dayTrips[0].status]?.bg || STATUS_COLOR_MAP.draft.bg,
                          STATUS_COLOR_MAP[dayTrips[0].status]?.text || STATUS_COLOR_MAP.draft.text,
                          STATUS_COLOR_MAP[dayTrips[0].status]?.border || STATUS_COLOR_MAP.draft.border
                        )}
                        title={`Click to open Trip ${tripNumberService.format(dayTrips[0].trip_number)} (${dayTrips[0].route?.from_location || dayTrips[0].origin} → ${dayTrips[0].route?.to_location || dayTrips[0].destination})`}
                      >
                        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', STATUS_COLOR_MAP[dayTrips[0].status]?.dot || STATUS_COLOR_MAP.draft.dot)} />
                        <span className="font-mono text-[9.5px] font-bold shrink-0">
                          {tripNumberService.format(dayTrips[0].trip_number).replace('TRP-', '')}
                        </span>
                        <span className="truncate">
                          {dayTrips[0].route?.to_location || dayTrips[0].destination || dayTrips[0].origin}
                        </span>
                      </div>
                    )}

                    {dayTrips.length >= 2 && (
                      <>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/trips/${dayTrips[0].id}`);
                          }}
                          className={cn(
                            'px-1.5 py-0.5 rounded text-[10px] font-medium border truncate flex items-center gap-1 transition-all cursor-pointer shadow-2xs hover:brightness-125 hover:ring-1 hover:ring-primary/40',
                            STATUS_COLOR_MAP[dayTrips[0].status]?.bg || STATUS_COLOR_MAP.draft.bg,
                            STATUS_COLOR_MAP[dayTrips[0].status]?.text || STATUS_COLOR_MAP.draft.text,
                            STATUS_COLOR_MAP[dayTrips[0].status]?.border || STATUS_COLOR_MAP.draft.border
                          )}
                          title={`Click to open Trip ${tripNumberService.format(dayTrips[0].trip_number)}`}
                        >
                          <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', STATUS_COLOR_MAP[dayTrips[0].status]?.dot || STATUS_COLOR_MAP.draft.dot)} />
                          <span className="font-mono text-[9.5px] font-bold shrink-0">
                            {tripNumberService.format(dayTrips[0].trip_number).replace('TRP-', '')}
                          </span>
                          <span className="truncate">
                            {dayTrips[0].route?.to_location || dayTrips[0].destination || dayTrips[0].origin}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDay(day);
                            setDayDialogOpen(true);
                          }}
                          className="w-full text-[9.5px] font-medium text-primary hover:text-primary-foreground hover:bg-primary/90 bg-primary/10 border border-primary/20 rounded px-1 py-0.5 text-center transition-all truncate flex items-center justify-center gap-1 cursor-pointer"
                          title={`View all ${dayTrips.length} trips on ${format(day, 'MMM d')}`}
                        >
                          +{dayTrips.length - 1} more ({dayTrips[1].route?.to_location || dayTrips[1].destination || 'trip'})
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {calendarMode === 'week' && (
        <div className="flex-1 min-h-0 bg-card border rounded-xl shadow-xs overflow-hidden flex flex-col">
          {/* Week Columns Matrix */}
          <div className="grid grid-cols-7 flex-1 divide-x overflow-y-auto">
            {weekDays.map((day) => {
              const dayTrips = getTripsForDay(day);
              const isTodayDate = isToday(day);

              return (
                <div key={day.toISOString()} className="flex flex-col min-w-0">
                  {/* Day Column Header */}
                  <div
                    className={cn(
                      'p-2.5 border-b text-center shrink-0 flex flex-col items-center gap-1',
                      isTodayDate ? 'bg-primary/10 border-b-primary/30' : 'bg-muted/30'
                    )}
                  >
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                      {format(day, 'EEE')}
                    </span>
                    <span
                      className={cn(
                        'text-sm font-semibold flex items-center justify-center w-7 h-7 rounded-full',
                        isTodayDate ? 'bg-primary text-primary-foreground font-bold shadow-xs' : 'text-foreground'
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {dayTrips.length} {dayTrips.length === 1 ? 'trip' : 'trips'}
                    </span>
                  </div>

                  {/* Trips in Day */}
                  <div className="flex-1 p-2 space-y-2 overflow-y-auto min-h-0">
                    {dayTrips.length === 0 ? (
                      <div className="py-8 text-center text-[11px] text-muted-foreground/50 border border-dashed rounded-lg p-2">
                        No trips scheduled
                      </div>
                    ) : (
                      dayTrips.map((trip) => {
                        const colorConf = STATUS_COLOR_MAP[trip.status] || STATUS_COLOR_MAP.draft;
                        return (
                          <div
                            key={trip.id}
                            onClick={() => router.push(`/trips/${trip.id}`)}
                            className={cn(
                              'p-2.5 rounded-lg border bg-card/80 hover:bg-card hover:border-primary/50 transition-all cursor-pointer space-y-1.5 shadow-2xs',
                              colorConf.border
                            )}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-mono text-[11px] font-bold text-primary truncate">
                                {tripNumberService.format(trip.trip_number)}
                              </span>
                              <TripStatusBadge status={trip.status} size="sm" />
                            </div>

                            <div className="text-[11px] font-medium text-foreground truncate">
                              {trip.customer?.name || 'No Customer Assigned'}
                            </div>

                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/40 p-1.5 rounded truncate">
                              <MapPin className="h-3 w-3 text-primary shrink-0" />
                              <span className="truncate">{trip.route?.from_location || trip.origin}</span>
                              <ArrowRight className="h-2.5 w-2.5 shrink-0" />
                              <span className="truncate">{trip.route?.to_location || trip.destination}</span>
                            </div>

                            <div className="pt-1 flex items-center justify-between text-[10px] text-muted-foreground border-t">
                              <span className="truncate">{trip.vehicle?.license_plate || 'No Vehicle'}</span>
                              <span className="truncate">{trip.driver?.name || 'No Driver'}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Day Trips Modal */}
      <Dialog open={dayDialogOpen} onOpenChange={setDayDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <CalendarIcon className="h-4 w-4 text-primary" />
              Trips on {selectedDay ? format(selectedDay, 'EEEE, MMMM d, yyyy') : ''}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {selectedDayTrips.map((trip) => (
              <Card
                key={trip.id}
                onClick={() => {
                  setDayDialogOpen(false);
                  router.push(`/trips/${trip.id}`);
                }}
                className="cursor-pointer hover:border-primary/50 transition-all shadow-2xs border bg-card/70"
              >
                <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-semibold text-primary">
                      {tripNumberService.format(trip.trip_number)}
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {trip.customer?.name || 'No Customer Assigned'}
                    </p>
                  </div>
                  <TripStatusBadge status={trip.status} size="sm" />
                </CardHeader>

                <CardContent className="p-3 pt-0 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs bg-muted/40 p-1.5 rounded">
                    <MapPin className="h-3 w-3 text-primary shrink-0" />
                    <span className="truncate font-medium">
                      {trip.route?.from_location || trip.origin}
                    </span>
                    <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                    <span className="truncate font-medium">
                      {trip.route?.to_location || trip.destination}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
                    <div className="flex items-center gap-1">
                      <Car className="h-3 w-3" />
                      <span>{trip.vehicle?.license_plate || 'No Vehicle'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{trip.driver?.name || 'No Driver'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
