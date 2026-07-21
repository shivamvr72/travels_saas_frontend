'use client';

import { useState } from 'react';
import { AppPageContainer } from '@/components/layout/crud/app-page-container';
import { useExecutiveSummary } from '@/features/reports/hooks/use-executive-summary';
import { useFleetSummary } from '@/features/reports/hooks/use-fleet-analytics';
import { useFleetSummary as useFleetHealthSummary } from '@/shared/hooks/use-generic-engines';
import { useTripList } from '@/features/trips/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Briefcase, Car, Activity, Users, AlertTriangle } from 'lucide-react';
import { ReportDateFilter } from '@/features/reports/domain/reports-types';
import { AppStatusBadge } from '@/components/shared/app-status-badge';
import { TripStatusBadge } from '@/features/trips/components/trip-status-badge';
import Link from 'next/link';

export default function DashboardPage() {
  // Use 'this_month' filter for the operational dashboard to show some data
  const [filter] = useState<ReportDateFilter>({ period: 'this_month' });
  const { data: summary, isLoading } = useExecutiveSummary(filter);
  const { data: fleetData, isLoading: fleetLoading } = useFleetSummary(filter);
  const { data: tripsData, isLoading: tripsLoading } = useTripList({ page: 1, page_size: 5 });
  const { data: healthData, isLoading: healthLoading } = useFleetHealthSummary();

  return (
    <AppPageContainer maxWidth="full" className="pb-4 flex flex-col h-full gap-4">
      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-500" />
                Active Trips Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summary?.active_trips || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently in progress</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                Completed Trips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summary?.completed_trips || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Successfully finished today</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Car className="h-4 w-4 text-purple-500" />
                Vehicles on Road
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summary?.vehicles_running || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Out of {((summary?.vehicles_running || 0) + (summary?.vehicles_idle || 0))} total fleet</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Idle Vehicles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summary?.vehicles_idle || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Ready for assignment</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Operational widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
         <Card className="lg:col-span-2">
           <CardHeader>
             <CardTitle>Fleet Health & Compliance</CardTitle>
             <CardDescription>System-wide engine health metrics</CardDescription>
           </CardHeader>
           <CardContent>
             {healthLoading ? (
               <div className="flex h-[100px] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
             ) : (
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                 <div className="flex flex-col p-4 bg-muted/50 rounded-lg">
                   <span className="text-sm text-muted-foreground">Available Vehicles</span>
                   <span className="text-2xl font-bold">{healthData?.vehicles_available || 0}</span>
                 </div>
                 <div className="flex flex-col p-4 bg-muted/50 rounded-lg">
                   <span className="text-sm text-muted-foreground">Available Drivers</span>
                   <span className="text-2xl font-bold">{healthData?.drivers_available || 0}</span>
                 </div>
                 <div className="flex flex-col p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
                   <span className="text-sm font-medium">Expiring Documents</span>
                   <span className="text-2xl font-bold">{healthData?.documents_expiring_soon || 0}</span>
                 </div>
                 <div className="flex flex-col p-4 bg-orange-500/10 text-orange-600 rounded-lg border border-orange-500/20">
                   <span className="text-sm font-medium">Pending Verifications</span>
                   <span className="text-2xl font-bold">{healthData?.documents_awaiting_verification || 0}</span>
                 </div>
                 <div className="flex flex-col p-4 bg-muted/50 rounded-lg">
                   <span className="text-sm text-muted-foreground">Unread Notifications</span>
                   <span className="text-2xl font-bold">{healthData?.unread_notifications || 0}</span>
                 </div>
                 <div className="flex flex-col p-4 bg-muted/50 rounded-lg">
                   <span className="text-sm text-muted-foreground">Blocked Resources</span>
                   <span className="text-2xl font-bold">{healthData?.blocked_resources || 0}</span>
                 </div>
               </div>
             )}
           </CardContent>
         </Card>

         <Card>
           <CardHeader>
             <CardTitle>Fleet Status</CardTitle>
             <CardDescription>Live status of your vehicles</CardDescription>
           </CardHeader>
           <CardContent className="max-h-[400px] overflow-y-auto no-scrollbar">
             {fleetLoading ? (
               <div className="flex h-32 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
             ) : !fleetData || fleetData.length === 0 ? (
               <div className="flex h-32 flex-col items-center justify-center text-muted-foreground">
                 <Car className="h-12 w-12 opacity-20 mb-2" />
                 <p className="text-sm">No vehicles found</p>
               </div>
             ) : (
               <div className="space-y-4 pr-2">
                 {fleetData.map(v => (
                   <div key={v.vehicle_id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                     <div>
                       <p className="font-medium text-sm">{v.reg_number}</p>
                       <p className="text-xs text-muted-foreground">{v.vehicle_name || 'Unknown'}</p>
                     </div>
                     <AppStatusBadge status={v.status === 'running' || v.status === 'active' ? 'success' : 'inactive'} size="sm" showIcon={false}>
                       {v.status === 'running' || v.status === 'active' ? 'Active' : 'Idle'}
                     </AppStatusBadge>
                   </div>
                 ))}
               </div>
             )}
           </CardContent>
         </Card>

         <Card>
           <CardHeader>
             <CardTitle>Recent Trips</CardTitle>
             <CardDescription>Latest trip activities</CardDescription>
           </CardHeader>
           <CardContent className="max-h-[400px] overflow-y-auto no-scrollbar">
             {tripsLoading ? (
               <div className="flex h-32 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
             ) : !tripsData?.items || tripsData.items.length === 0 ? (
               <div className="flex h-32 flex-col items-center justify-center text-muted-foreground">
                 <Briefcase className="h-12 w-12 opacity-20 mb-2" />
                 <p className="text-sm">No recent trips</p>
               </div>
             ) : (
               <div className="space-y-4 pr-2">
                 {tripsData.items.map(trip => (
                   <div key={trip.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                     <div className="flex flex-col">
                       <Link href={`/trips/${trip.id}`} className="font-medium text-sm hover:underline text-primary">
                         {trip.trip_number || 'TRIP'}
                       </Link>
                       <p className="text-xs text-muted-foreground truncate w-48">
                         {trip.customer?.name || 'Unknown Customer'}
                       </p>
                     </div>
                     <div className="flex flex-col items-end gap-1">
                       <TripStatusBadge status={trip.status} size="sm" />
                       <p className="text-[10px] text-muted-foreground">{trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'N/A'}</p>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </CardContent>
         </Card>
      </div>

    </AppPageContainer>
  );
}
