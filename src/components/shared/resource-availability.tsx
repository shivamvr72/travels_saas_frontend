import { useState } from 'react';
import { useAvailability } from '@/shared/hooks/use-generic-engines';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trash2 } from 'lucide-react';
import { formatDateTime } from '@/shared/utils';
import { components } from '@/shared/types/api';

type AvailabilityResponse = components['schemas']['AvailabilityResponse'];

export function ResourceAvailability({ entityType, entityId }: { entityType: string, entityId: string }) {
  const { data, isLoading, deleteBlock } = useAvailability(entityType, entityId);

  if (isLoading) return <div>Loading availability...</div>;

  const blocks = data || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Availability Blocks</h3>
        <Button size="sm">Add Block</Button>
      </div>
      
      {blocks.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground border border-dashed rounded">
          No unavailability blocks. Resource is available.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {blocks.map((block: AvailabilityResponse) => (
            <Card key={block.id}>
              <CardContent className="p-4 flex justify-between items-start">
                <div>
                  <div className="font-semibold">{block.reason}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4" />
                    {formatDateTime(block.start_time)} - {formatDateTime(block.end_time)}
                  </div>
                  <Badge className="mt-2" variant={block.status === 'ACTIVE' ? 'default' : 'secondary'}>{block.status}</Badge>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteBlock.mutate(block.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
