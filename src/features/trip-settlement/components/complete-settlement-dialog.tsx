'use client';

import { useState } from 'react';
import { useCompleteSettlement } from '../api/trip-settlement-api';
import { Button } from '@/components/ui/button';
import { AppConfirmDialog } from '@/components/shared/app-confirm-dialog';
import { toast } from 'sonner';

export function CompleteSettlementDialog({ tripId }: { tripId: string }) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: completeSettlement, isPending } = useCompleteSettlement();

  const handleConfirm = async () => {
    try {
      await completeSettlement(tripId);
      toast.success('Trip settled successfully');
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to settle trip');
    }
  };

  return (
    <>
      <Button className="w-full" onClick={() => setOpen(true)}>
        Complete Settlement
      </Button>

      <AppConfirmDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Complete Settlement"
        description="Are you sure you want to finalize this settlement? This action will lock the financial ledger for this trip and cannot be undone."
        confirmLabel="Yes, Settle Trip"
        cancelLabel="Cancel"
        onConfirm={handleConfirm}
        isDestructive={false}
      />
    </>
  );
}
