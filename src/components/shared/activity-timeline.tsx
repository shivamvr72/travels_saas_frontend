"use client";

import { useActivity } from '@/shared/hooks/use-generic-engines';
import { Timeline, TimelineItem, TimelineIcon, TimelineContent, TimelineTitle, TimelineDescription, TimelineTime } from '@/components/ui/timeline';
import { Activity, Clock } from 'lucide-react';
import { formatDateTime } from '@/shared/utils';
import { components } from '@/shared/types/api';

type ActivityResponse = components['schemas']['ActivityResponse'];

export function ActivityTimeline({ entityType, entityId }: { entityType: string, entityId: string }) {
  const { data, isLoading } = useActivity(entityType, entityId);

  if (isLoading) {
    return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-muted rounded w-3/4"></div></div></div>;
  }

  if (!data?.data || data.data.length === 0) {
    return <div className="text-muted-foreground p-4 border border-dashed rounded text-center">No recent activity.</div>;
  }

  return (
    <Timeline>
      {data.data.map((item: ActivityResponse) => (
        <TimelineItem key={item.id}>
          <TimelineIcon>
            <Activity className="h-4 w-4 text-primary" />
          </TimelineIcon>
          <TimelineContent>
            <TimelineTitle>{item.title}</TimelineTitle>
            <TimelineTime className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDateTime(item.created_at)}
              {item.actor_role && ` by ${item.actor_role}`}
            </TimelineTime>
            <TimelineDescription>{item.description}</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
