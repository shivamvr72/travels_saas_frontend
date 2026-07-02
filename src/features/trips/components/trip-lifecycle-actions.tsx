import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trip, TripStatus } from '../domain/trip-types';
import { useTripLifecycle } from '../hooks/use-trip-lifecycle';
import { RequirePermission } from '@/shared/permissions/require-permission';
import { AppConfirmDialog } from '@/components/shared/app-confirm-dialog';
import { PERMISSIONS } from '@/shared/permissions';
import { getActionDef } from '../domain/trip-actions';
import { TripCancelDialog } from './trip-cancel-dialog';

interface TripLifecycleActionsProps {
  trip: Trip;
}

export function TripLifecycleActions({ trip }: TripLifecycleActionsProps) {
  const { availableActions, execute, isPending } = useTripLifecycle(trip);
  const [confirmAction, setConfirmAction] = useState<TripStatus | null>(null);

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

  const handleConfirm = () => {
    if (confirmAction) {
      execute(confirmAction);
      setConfirmAction(null);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {availableActions.map((action) => {
        const Icon = action.icon;
        
        // Map target status to required permission
        let requiredPermission: any = PERMISSIONS.TRIPS_EDIT;
        if (action.targetStatus === 'dispatched' || action.targetStatus === 'in_progress') {
          requiredPermission = PERMISSIONS.TRIPS_DISPATCH;
        } else if (action.targetStatus === 'assigned') {
          requiredPermission = PERMISSIONS.TRIPS_ASSIGN;
        } else if (action.targetStatus === 'cancelled') {
          requiredPermission = PERMISSIONS.TRIPS_CANCEL;
        } else if (action.targetStatus === 'closed') {
          requiredPermission = PERMISSIONS.TRIPS_CLOSE;
        }

        return (
          <RequirePermission key={action.targetStatus} roles={requiredPermission as any}>
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
          </RequirePermission>
        );
      })}

      <AppConfirmDialog
        isOpen={!!confirmAction && confirmAction !== 'cancelled'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        title={`Confirm ${confirmAction ? getActionDef(confirmAction).label : ''}`}
        description={`Are you sure you want to transition this trip to ${confirmAction}?`}
        cancelLabel="Cancel"
        isDestructive={confirmAction ? getActionDef(confirmAction).variant === 'destructive' : false}
      />

      <TripCancelDialog
        isOpen={confirmAction === 'cancelled'}
        onClose={() => setConfirmAction(null)}
        tripId={trip.id}
      />
    </div>
  );
}
