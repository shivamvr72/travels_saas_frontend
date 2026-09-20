'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trip, TripStatus } from '../domain/trip-types';
import { TripStatusBadge } from './trip-status-badge';
import { tripNumberService } from '../services/trip-number.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
} from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { cn } from '@/lib/utils';

interface TripCalendarViewProps {
  trips: Trip[];
  isLoading?: boolean;
}

const STATUS_COLOR_MAP: Record<TripStatus | string, { bg: string; text: string; dot: string }> = {
  draft: { bg: 'bg-slate-500/15 hover:bg-slate-500/25', text: 'text-slate-300', dot: 'bg-slate-400' },
  assigned: { bg: 'bg-blue-500/15 hover:bg-blue-500/25', text: 'text-blue-300', dot: 'bg-blue-400' },
  dispatched: { bg: 'bg-amber-500/15 hover:bg-amber-500/25', text: 'text-amber-300', dot: 'bg-amber-400' },
  started: { bg: 'bg-emerald-500/15 hover:bg-emerald-500/25', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  completed: { bg: 'bg-indigo-500/15 hover:bg-indigo-500/25', text: 'text-indigo-300', dot: 'bg-indigo-400' },
  settled: { bg: 'bg-zinc-500/15 hover:bg-zinc-500/25', text: 'text-zinc-300', dot: 'bg-zinc-400' },
  cancelled: { bg: 'bg-rose-500/15 hover:bg-rose-500/25', text: 'text-rose-300', dot: 'bg-rose-400' },
};

export function TripCalendarView({ trips, isLoading }: TripCalendarViewProps) {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [dayDialogOpen, setDayDialogOpen] = useState(false);

  // Month intervals
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const getTripsForDay = (day: Date): Trip[] => {
    return trips.filter((t) => {
      if (!t.start_date) return false;
      try {
        return isSameDay(new Date(t.start_date), day);
      } catch {
        return false;
      }
    });
  };

  const selectedDayTrips = selectedDay ? getTripsForDay(selectedDay) : [];

  const handleDayClick = (day: Date, dayTrips: Trip[]) => {
    if (dayTrips.length > 0) {
      setSelectedDay(day);
      setDayDialogOpen(true);
    }
  };

  const monthTripsCount = trips.filter((t) => {
    if (!t.start_date) return false;
    try {
      return isSameMonth(new Date(t.start_date), currentMonth);
    } catch {
      return false;
    }
  }).length;

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3">
      {/* Calendar Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-card border rounded-xl shadow-xs shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="h-8 text-xs font-medium"
          >
            Today
          </Button>

          <h2 className="text-base font-semibold tracking-tight ml-2">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs px-2.5 py-1 font-medium">
            {monthTripsCount} {monthTripsCount === 1 ? 'Trip' : 'Trips'} in {format(currentMonth, 'MMM')}
          </Badge>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="flex-1 min-h-0 bg-card border rounded-xl shadow-xs overflow-hidden flex flex-col">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 border-b bg-muted/40 text-center text-xs font-semibold py-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, idx) => (
            <div
              key={dayName}
              className={cn(
                'py-1',
                idx === 0 || idx === 6 ? 'text-muted-foreground' : 'text-foreground'
              )}
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 flex-1 auto-rows-fr divide-x divide-y border-b overflow-y-auto">
          {calendarDays.map((day) => {
            const dayTrips = getTripsForDay(day);
            const inCurrentMonth = isSameMonth(day, currentMonth);
            const isTodayDate = isToday(day);

            return (
              <div
                key={day.toISOString()}
                onClick={() => handleDayClick(day, dayTrips)}
                className={cn(
                  'min-h-[110px] p-2 flex flex-col gap-1 transition-colors select-none',
                  !inCurrentMonth && 'bg-muted/15 text-muted-foreground/40',
                  inCurrentMonth && 'hover:bg-accent/40',
                  dayTrips.length > 0 && 'cursor-pointer'
                )}
              >
                {/* Date Number Indicator */}
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'text-xs font-semibold flex items-center justify-center w-6 h-6 rounded-full',
                      isTodayDate && 'bg-primary text-primary-foreground',
                      !isTodayDate && inCurrentMonth && 'text-foreground',
                      !inCurrentMonth && 'text-muted-foreground/40'
                    )}
                  >
                    {format(day, 'd')}
                  </span>

                  {dayTrips.length > 0 && (
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {dayTrips.length}
                    </span>
                  )}
                </div>

                {/* Trip Pills */}
                <div className="flex-1 flex flex-col gap-1 overflow-hidden mt-1">
                  {dayTrips.slice(0, 3).map((trip) => {
                    const colorConf = STATUS_COLOR_MAP[trip.status] || STATUS_COLOR_MAP.draft;

                    return (
                      <div
                        key={trip.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/trips/${trip.id}`);
                        }}
                        className={cn(
                          'px-2 py-1 rounded text-[11px] font-medium border border-transparent truncate flex items-center gap-1.5 transition-all cursor-pointer',
                          colorConf.bg,
                          colorConf.text
                        )}
                        title={`${tripNumberService.format(trip.trip_number)}: ${trip.route?.from_location || trip.origin} → ${trip.route?.to_location || trip.destination}`}
                      >
                        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', colorConf.dot)} />
                        <span className="font-mono text-[10px] font-semibold shrink-0">
                          {tripNumberService.format(trip.trip_number).slice(-6)}
                        </span>
                        <span className="truncate">
                          {trip.route?.from_location || trip.origin}
                        </span>
                      </div>
                    );
                  })}

                  {dayTrips.length > 3 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDayClick(day, dayTrips);
                      }}
                      className="text-[10px] font-medium text-primary hover:underline text-left pl-1"
                    >
                      +{dayTrips.length - 3} more
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Trips Modal */}
      <Dialog open={dayDialogOpen} onOpenChange={setDayDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <CalendarIcon className="h-4 w-4 text-primary" />
              Trips for {selectedDay ? format(selectedDay, 'EEEE, MMMM d, yyyy') : ''}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {selectedDayTrips.map((trip) => (
              <Card
                key={trip.id}
                onClick={() => {
                  setDayDialogOpen(false);
                  router.push(`/trips/${trip.id}`);
                }}
                className="cursor-pointer hover:border-primary/50 transition-all shadow-2xs"
              >
                <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-semibold text-primary">
                      {tripNumberService.format(trip.trip_number)}
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {trip.customer?.name || 'No Customer'}
                    </p>
                  </div>
                  <TripStatusBadge status={trip.status} size="sm" />
                </CardHeader>

                <CardContent className="p-3 pt-0 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs bg-muted/30 p-1.5 rounded">
                    <MapPin className="h-3 w-3 text-primary shrink-0" />
                    <span className="truncate font-medium">
                      {trip.route?.from_location || trip.origin}
                    </span>
                    <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                    <span className="truncate font-medium">
                      {trip.route?.to_location || trip.destination}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
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
