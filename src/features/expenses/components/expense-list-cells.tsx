'use client';

import { useVehicles } from '@/features/vehicles/api';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/axios';
import { Badge } from '@/components/ui/badge';
import { Car, Hash } from 'lucide-react';

// ─── Vehicle Name Cell ────────────────────────────────────────────────────────
// Resolves a vehicle UUID to "REG_NO • Brand Model" using a single cached list query.
// React Query deduplicates this across all rows — only ONE network request for the whole table.

interface VehicleNameCellProps {
  vehicleId: string | null | undefined;
}

export function VehicleNameCell({ vehicleId }: VehicleNameCellProps) {
  const { data } = useVehicles({ page_size: 200 });
  const vehicles = (data as any)?.data || (data as any)?.items || [];

  // Check if vehicle is in the active list
  const activeVehicle = vehicles.find((v: any) => v.id === vehicleId);

  // If not in active list (e.g. inactive vehicle), fetch it directly
  const { data: fallbackVehicle } = useQuery({
    queryKey: ['vehicles', 'detail', vehicleId],
    queryFn: () => apiClient.get(`/api/v1/vehicles/${vehicleId}`).then(r => r.data),
    enabled: !!vehicleId && !activeVehicle,
    staleTime: 5 * 60 * 1000,
  });

  if (!vehicleId) {
    return <span className="text-muted-foreground text-xs">—</span>;
  }

  const vehicle = activeVehicle || fallbackVehicle;

  if (!vehicle) {
    // Still loading or not found — show truncated UUID
    return (
      <span className="text-muted-foreground font-mono text-xs">
        {vehicleId.slice(0, 8)}…
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Car className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <span className="font-medium">{vehicle.reg_number}</span>
      {(vehicle.brand_name || vehicle.model_type) && (
        <span className="text-muted-foreground text-xs">
          {[vehicle.brand_name, vehicle.model_type].filter(Boolean).join(' ')}
        </span>
      )}
    </div>
  );
}

// ─── Trip Link Cell ───────────────────────────────────────────────────────────
// Shows a compact trip reference when the expense is linked to a trip.

interface TripRefCellProps {
  tripId: string | null | undefined;
}

export function TripRefCell({ tripId }: TripRefCellProps) {
  // Fetch trip number from API — React Query caches by tripId, so repeated renders are free
  const { data: trip } = useQuery({
    queryKey: ['trips', 'detail', tripId],
    queryFn: () => apiClient.get(`/api/v1/trips/${tripId}`).then(r => r.data),
    enabled: !!tripId,
    staleTime: 5 * 60 * 1000,
  });

  if (!tripId) {
    return <span className="text-muted-foreground text-xs">—</span>;
  }

  let tripDisplay = tripId.slice(0, 8) + '…';
  
  if (trip) {
    if (trip.booking_reference) {
      tripDisplay = trip.booking_reference;
    } else if (trip.locations && trip.locations.length > 0) {
      const from = trip.locations[0].from_location;
      const to = trip.locations[trip.locations.length - 1].to_location;
      tripDisplay = `${from} → ${to}`;
    } else if (trip.trip_date) {
      tripDisplay = `Trip on ${trip.trip_date}`;
    }
  }

  return (
    <Badge variant="outline" className="text-xs font-medium gap-1 px-1.5 max-w-[200px] truncate block">
      {tripDisplay}
    </Badge>
  );
}

// ─── Description Cell ─────────────────────────────────────────────────────────
// Renders vendor name and notes if available

interface DescriptionCellProps {
  vendorName: string | null | undefined;
  notes: string | null | undefined;
}

export function DescriptionCell({ vendorName, notes }: DescriptionCellProps) {
  if (!vendorName && !notes) {
    return <span className="text-muted-foreground text-xs">—</span>;
  }
  return (
    <div className="flex flex-col gap-0.5">
      {vendorName && <span className="font-medium text-sm">{vendorName}</span>}
      {notes && <span className="text-muted-foreground text-xs truncate max-w-[250px]">{notes}</span>}
    </div>
  );
}

// ─── Odometer Cell ────────────────────────────────────────────────────────────
// Renders km reading with a fallback dash.

interface OdometerCellProps {
  km: number | null | undefined;
}

export function OdometerCell({ km }: OdometerCellProps) {
  if (km == null) {
    return <span className="text-muted-foreground text-xs">—</span>;
  }
  return (
    <span className="tabular-nums">
      {km.toLocaleString('en-IN')} <span className="text-muted-foreground text-xs">km</span>
    </span>
  );
}
