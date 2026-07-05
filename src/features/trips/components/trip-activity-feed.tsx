import { ActivityFeedEvent } from '../domain/trip-types';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, FileText, AlertCircle, Play, XCircle, Clock, User, FileUp, Info, History } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface TripActivityFeedProps {
  events: ActivityFeedEvent[];
  isLoading?: boolean;
}

export function TripActivityFeed({ events, isLoading }: TripActivityFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 flex gap-4">
              <div className="w-10 h-10 bg-muted rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground border rounded-lg bg-muted/20 border-dashed">
        <History className="h-8 w-8 mb-4 opacity-50" />
        <p>No activity recorded yet.</p>
      </div>
    );
  }

  const getEventIcon = (type: ActivityFeedEvent['event_type']) => {
    switch (type) {
      case 'trip_created':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'trip_planned':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'trip_assigned':
      case 'vehicle_assigned':
      case 'driver_assigned':
      case 'co_driver_assigned':
        return <User className="h-5 w-5 text-indigo-500" />;
      case 'trip_dispatched':
      case 'trip_started':
        return <Play className="h-5 w-5 text-primary" />;
      case 'trip_completed':
      case 'trip_closed':
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
      case 'trip_cancelled':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'document_uploaded':
        return <FileUp className="h-5 w-5 text-orange-500" />;
      case 'note_added':
        return <FileText className="h-5 w-5 text-slate-500" />;
      case 'details_updated':
        return <Info className="h-5 w-5 text-blue-400" />;
      case 'expense_added':
      case 'expense_updated':
        return <FileText className="h-5 w-5 text-amber-500" />;
      case 'invoice_generated':
        return <FileText className="h-5 w-5 text-indigo-500" />;
      case 'invoice_cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'payment_received':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'outstanding_updated':
        return <Info className="h-5 w-5 text-amber-500" />;
      case 'receipt_uploaded':
        return <FileUp className="h-5 w-5 text-teal-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="relative space-y-4 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
      {events.map((event) => (
        <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          {/* Icon */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
            {getEventIcon(event.event_type)}
          </div>
          
          {/* Card */}
          <Card className={cn(
            "w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)]",
            event.is_local && "opacity-70"
          )}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-semibold text-sm">{event.title}</h4>
                <time className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                </time>
              </div>
              <p className="text-sm text-muted-foreground">{event.description}</p>
              
              {event.actor && (
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary">
                    {event.actor.charAt(0)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    By <span className="font-medium text-foreground">{event.actor}</span>
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
