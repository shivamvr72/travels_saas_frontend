import { Trip } from '../../domain/trip-types';
import { TripActivityFeed } from '../../components/trip-activity-feed';
import { useActivityFeed } from '../../hooks/use-activity-feed';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TripActivityTabProps {
  trip: Trip;
}

export function TripActivityTab({ trip }: TripActivityTabProps) {
  const { data, isLoading } = useActivityFeed(trip.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Activity Timeline</h3>
          <p className="text-sm text-muted-foreground">Recent events and lifecycle changes</p>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Note
        </Button>
      </div>

      <div className="max-w-3xl mx-auto py-6">
        <TripActivityFeed events={data?.events || []} isLoading={isLoading} />
      </div>
    </div>
  );
}
