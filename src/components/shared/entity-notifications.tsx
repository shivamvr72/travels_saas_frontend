"use client";

import { useNotifications } from '@/shared/hooks/use-generic-engines';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/shared/utils';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { components } from '@/shared/types/api';

type NotificationResponse = components['schemas']['NotificationResponse'];

export function EntityNotifications({ entityType, entityId }: { entityType: string, entityId: string }) {
  const { data, isLoading, markAsRead } = useNotifications();

  if (isLoading) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-muted rounded w-3/4"></div></div></div>;

  const notifications = (data || []).filter((n: NotificationResponse) => n.reference_type === entityType && n.reference_id === entityId);

  if (notifications.length === 0) {
    return (
      <div className="text-muted-foreground p-8 border border-dashed rounded flex flex-col items-center">
        <Bell className="h-10 w-10 text-muted-foreground mb-4" />
        <p>No notifications for this entity.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notif: NotificationResponse) => (
        <Card key={notif.id} className={!notif.is_read ? 'bg-muted/30 border-primary/20' : ''}>
          <CardContent className="p-4 flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{notif.title}</span>
                {!notif.is_read && <Badge variant="secondary" className="text-xs h-5">New</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">{notif.message}</p>
              <div className="text-xs text-muted-foreground mt-2">
                {formatDateTime(notif.created_at)}
              </div>
            </div>
            {!notif.is_read && (
              <Button variant="ghost" size="sm" onClick={() => markAsRead.mutate(notif.id)}>
                Mark Read
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
