import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useTripTransition } from '../api';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TripCancelDialogProps {
  tripId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TripCancelDialog({
  tripId,
  isOpen,
  onClose,
}: TripCancelDialogProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const transitionMutation = useTripTransition();
  const queryClient = useQueryClient();

  const handleCancelTrip = () => {
    if (reason.length < 10) {
      setError('Please provide a reason of at least 10 characters.');
      return;
    }

    transitionMutation.mutate(
      { id: tripId, action: 'cancelled', payload: { reason } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['trips', tripId] });
          queryClient.invalidateQueries({ queryKey: ['trips'] });
          onClose();
          setReason('');
          setError(null);
        },
        onError: (err: unknown) => {
          const errorResponse = err as { response?: { data?: { detail?: string } } };
          setError(errorResponse?.response?.data?.detail || 'Failed to cancel the trip. Please try again.');
        }
      }
    );
  };

  const handleClose = () => {
    if (!transitionMutation.isPending && !error) {
      onClose();
      setReason('');
      setError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-destructive">Cancel Trip</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this trip? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Cancellation Reason <span className="text-destructive">*</span>
            </label>
            <Textarea
              placeholder="Provide a detailed reason for cancellation..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Minimum 10 characters required.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={transitionMutation.isPending}>
            Keep Trip
          </Button>
          <Button 
            onClick={handleCancelTrip} 
            disabled={reason.length < 10 || transitionMutation.isPending}
            variant="destructive"
          >
            {transitionMutation.isPending ? 'Cancelling...' : 'Cancel Trip'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
