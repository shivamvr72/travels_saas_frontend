import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trip, TripStatus } from '../domain/trip-types';
import { useTripLifecycle } from '../hooks/use-trip-lifecycle';
import { Can } from '@/shared/permissions/can';
import { AppConfirmDialog } from '@/components/shared/app-confirm-dialog';
import { PERMISSION_KEYS } from '@/shared/permissions';
import { getActionDef } from '../domain/trip-actions';
import { TripCancelDialog } from './trip-cancel-dialog';

interface TripLifecycleActionsProps {
  trip: Trip;
}

export function TripLifecycleActions({ trip }: TripLifecycleActionsProps) {
  const { availableActions, execute, isPending } = useTripLifecycle(trip);
  const [confirmAction, setConfirmAction] = useState<TripStatus | null>(null);
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    if (trip.status === 'billed' || trip.status === 'paid') {
      import('@/features/finance/services/payment.service').then(({ PaymentService }) => {
        PaymentService.getPaymentDetails(trip.id)
          .then(details => { if (details) setIsSettled(details.is_settled); })
          .catch(err => console.error('Failed to fetch payment status for lifecycle actions', err));
      });
    }
  }, [trip.id, trip.status]);

  if (!availableActions || availableActions.length === 0) {
    return null;
  }

  const handleActionClick = (targetStatus: TripStatus) => {
    const actionDef = getActionDef(targetStatus);
    if (targetStatus === 'cancelled') {
      setConfirmAction('cancelled');
    } else if (actionDef.requiresConfirmation) {
      setConfirmAction(targetStatus);
    } else {
      execute(targetStatus);
    }
  };

  const handleConfirm = async () => {
    if (confirmAction) {
      try {
        await execute(confirmAction);
        setConfirmAction(null);
      } catch (error) {
        // Error is already toasted by execute(), keep dialog open
        throw error; 
      }
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {availableActions
        .filter(action => !(action.targetStatus === 'paid' && isSettled))
        .map((action) => {
        const Icon = action.icon;
        
        // Map target status to required permission
        let requiredPermission: any = PERMISSION_KEYS.TRIPS_EDIT;
        if (action.targetStatus === 'in_progress') {
          requiredPermission = PERMISSION_KEYS.TRIPS_DISPATCH;
        } else if (action.targetStatus === 'cancelled') {
          requiredPermission = PERMISSION_KEYS.TRIPS_CANCEL;
        } else if (action.targetStatus === 'billed' || action.targetStatus === 'paid') {
          requiredPermission = PERMISSION_KEYS.TRIPS_CLOSE;
        }

        return (
          <Can key={action.targetStatus} permission={requiredPermission}>
            <Button
              variant={action.variant}
              size="sm"
              disabled={isPending}
              onClick={() => handleActionClick(action.targetStatus)}
              className="gap-1.5"
            >
              <Icon className="w-4 h-4" />
              {action.label}
            </Button>
          </Can>
        );
      })}

      <AppConfirmDialog
        isOpen={!!confirmAction && confirmAction !== 'cancelled'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        title={`Confirm ${confirmAction ? getActionDef(confirmAction, trip.status).label : ''}`}
        description={`Are you sure you want to transition this trip to ${confirmAction}?`}
        cancelLabel="Cancel"
        isDestructive={confirmAction ? getActionDef(confirmAction, trip.status).variant === 'destructive' : false}
      />

      <TripCancelDialog
        isOpen={confirmAction === 'cancelled'}
        onClose={() => setConfirmAction(null)}
        tripId={trip.id}
      />
    </div>
  );
}
