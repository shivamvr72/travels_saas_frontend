'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trip, TripStatus } from '../domain/trip-types';
import { TripStatusBadge } from './trip-status-badge';
import { AppStatusBadge } from '@/components/shared/app-status-badge';
import { tripNumberService } from '../services/trip-number.service';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Car,
  User,
  MapPin,
  ArrowRight,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';

interface TripBoardViewProps {
  trips: Trip[];
  isLoading?: boolean;
}

interface ColumnConfig {
  id: string;
  title: string;
  statuses: TripStatus[];
  color: string;
  bgLight: string;
  badgeClass: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'draft',
    title: 'Draft / Planned',
    statuses: ['draft'],
    color: '#94a3b8',
    bgLight: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
    badgeClass: 'bg-slate-500/20 text-slate-300',
  },
  {
    id: 'assigned',
    title: 'Assigned',
    statuses: ['assigned'],
    color: '#3b82f6',
    bgLight: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    badgeClass: 'bg-blue-500/20 text-blue-300',
  },
  {
    id: 'dispatched',
    title: 'Dispatched',
    statuses: ['dispatched'],
    color: '#f59e0b',
    bgLight: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    badgeClass: 'bg-amber-500/20 text-amber-300',
  },
  {
    id: 'started',
    title: 'Running',
    statuses: ['started'],
    color: '#10b981',
    bgLight: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    badgeClass: 'bg-emerald-500/20 text-emerald-300',
  },
  {
    id: 'completed',
    title: 'Completed',
    statuses: ['completed'],
    color: '#6366f1',
    bgLight: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    badgeClass: 'bg-indigo-500/20 text-indigo-300',
  },
  {
    id: 'closed',
    title: 'Settled / Cancelled',
    statuses: ['settled', 'cancelled'],
    color: '#64748b',
    bgLight: 'bg-zinc-500/10 border-zinc-500/20 text-zinc-400',
    badgeClass: 'bg-zinc-500/20 text-zinc-300',
  },
];

export function TripBoardView({ trips, isLoading }: TripBoardViewProps) {
  const router = useRouter();

  const priorityColors: Record<string, 'inactive' | 'upcoming' | 'warning' | 'critical'> = {
    Low: 'inactive',
    Normal: 'upcoming',
    High: 'warning',
    Urgent: 'critical',
  };

  const getTripsForColumn = (statuses: TripStatus[]) => {
    return trips.filter((t) => statuses.includes(t.status));
  };

  return (
    <div className="flex-1 min-h-0 overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max h-full">
        {COLUMNS.map((column) => {
          const columnTrips = getTripsForColumn(column.statuses);

          return (
            <div
              key={column.id}
              className="w-80 flex flex-col rounded-xl bg-card border shadow-xs"
            >
              {/* Column Header */}
              <div className="p-3 border-b flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: column.color }}
                  />
                  <h3 className="font-semibold text-sm tracking-tight">
                    {column.title}
                  </h3>
                </div>
                <Badge variant="secondary" className="font-mono text-xs px-2 py-0.5">
                  {columnTrips.length}
                </Badge>
              </div>

              {/* Column Body */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-280px)]">
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-32 rounded-lg bg-muted/40 animate-pulse border"
                      />
                    ))}
                  </div>
                ) : columnTrips.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-xs text-muted-foreground border border-dashed rounded-lg p-4 text-center">
                    <p>No trips</p>
                  </div>
                ) : (
                  columnTrips.map((trip) => {
                    const formattedDate = trip.start_date
                      ? format(new Date(trip.start_date), 'MMM d, yyyy')
                      : 'Unscheduled';

                    return (
                      <Card
                        key={trip.id}
                        onClick={() => router.push(`/trips/${trip.id}`)}
                        className="group relative cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200 border bg-card/60 backdrop-blur-xs"
                      >
                        <CardHeader className="p-3 pb-2 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <Link
                              href={`/trips/${trip.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="font-mono text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                            >
                              {tripNumberService.format(trip.trip_number)}
                              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>

                            <AppStatusBadge
                              status={priorityColors[trip.priority] || 'inactive'}
                              size="sm"
                              showIcon={false}
                            >
                              {trip.priority}
                            </AppStatusBadge>
                          </div>

                          <div className="text-xs font-medium text-foreground truncate">
                            {trip.customer?.name || 'No Customer Assigned'}
                          </div>
                        </CardHeader>

                        <CardContent className="p-3 pt-0 space-y-2.5">
                          {/* Route Info */}
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 p-1.5 rounded-md">
                            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="truncate font-medium text-foreground">
                              {trip.route?.from_location || trip.origin || 'Origin'}
                            </span>
                            <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                            <span className="truncate font-medium text-foreground">
                              {trip.route?.to_location || trip.destination || 'Destination'}
                            </span>
                          </div>

                          {/* Date */}
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 shrink-0" />
                            <span>{formattedDate}</span>
                          </div>

                          {/* Resources: Vehicle & Driver */}
                          <div className="pt-2 border-t grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1 text-muted-foreground truncate" title={trip.vehicle?.license_plate || 'Unassigned'}>
                              <Car className="h-3 w-3 shrink-0" />
                              <span className="truncate font-medium">
                                {trip.vehicle?.license_plate || 'No Vehicle'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground justify-end truncate" title={trip.driver?.name || 'Unassigned'}>
                              <User className="h-3 w-3 shrink-0" />
                              <span className="truncate font-medium">
                                {trip.driver?.name || 'No Driver'}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
