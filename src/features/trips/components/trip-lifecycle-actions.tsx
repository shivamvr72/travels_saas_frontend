import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Trip, TripStatus } from '../domain/trip-types';
import { useTripLifecycle } from '../hooks/use-trip-lifecycle';
import { Can } from '@/shared/permissions/can';
import { AppConfirmDialog } from '@/components/shared/app-confirm-dialog';
import { PERMISSION_KEYS } from '@/shared/permissions';
import { getActionDef } from '../domain/trip-actions';
import { TripCancelDialog } from './trip-cancel-dialog';
import { useDeleteDraftTrip } from '../api';
import { Trash2 } from 'lucide-react';

interface TripLifecycleActionsProps {
  trip: Trip;
}

export function TripLifecycleActions({ trip }: TripLifecycleActionsProps) {
  const router = useRouter();
  const { availableActions, execute, isPending } = useTripLifecycle(trip);
  const deleteDraftMutation = useDeleteDraftTrip();
  const [confirmAction, setConfirmAction] = useState<TripStatus | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    if (trip.status === 'completed') {
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

  const handleDeleteDraft = async () => {
    try {
      await deleteDraftMutation.mutateAsync(trip.id);
      setShowDeleteConfirm(false);
      toast.success('Draft trip deleted successfully');
      router.push('/trips');
    } catch (error: any) {
      setShowDeleteConfirm(false);
      const detail = error.response?.data?.detail;
      const msg = typeof detail === 'string' ? detail : (error.message || 'Failed to delete draft trip');
      toast.error(msg);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {availableActions
        .filter((action) => {
          if (action.targetStatus === 'assigned' || action.targetStatus === 'draft') return false;
          // Hybrid approach: Draft trips use "Delete Draft", not "Cancel"
          if (action.targetStatus === 'cancelled' && trip.status === 'draft') return false;
          if (action.targetStatus === 'dispatched' && trip.status === 'draft') {
            const hasVeh = Boolean(trip.vehicle_id || trip.external_hiring_id || trip.vehicle || trip.external_hiring);
            const hasDrv = Boolean(trip.driver_id || trip.driver);
            return hasVeh && hasDrv;
          }
          return true;
        })
        .map((action) => {
        const Icon = action.icon;
        
        const permissionMap: Partial<Record<TripStatus, string>> = {
          dispatched: PERMISSION_KEYS.DISPATCH_ASSIGN,
          started:    PERMISSION_KEYS.TRIP_EVENT_CREATE,
          completed:  PERMISSION_KEYS.TRIP_EVENT_CREATE,
          cancelled:  PERMISSION_KEYS.TRIP_CANCEL,
          settled:    PERMISSION_KEYS.TRIP_SETTLEMENT_CREATE,
        };
        const requiredPermission = permissionMap[action.targetStatus] ?? PERMISSION_KEYS.TRIPS_EDIT;

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

      {trip.status === 'draft' && (
        <Can permission={PERMISSION_KEYS.TRIPS_DELETE}>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="gap-1.5"
            disabled={deleteDraftMutation.isPending}
          >
            <Trash2 className="w-4 h-4" />
            Delete Draft
          </Button>
        </Can>
      )}

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

      <AppConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteDraft}
        title="Delete Draft Trip?"
        description="This will permanently delete this draft trip and its associated draft records. This action cannot be undone."
        confirmLabel={deleteDraftMutation.isPending ? "Deleting..." : "Yes, Delete Draft"}
        isDestructive
      />
    </div>
  );
}
