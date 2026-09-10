'use client';

import { useState } from 'react';
import { CrudDetails } from '@/components/layout/crud/crud-details';
import { featureRegistry } from '@/shared/config/feature-registry';
import { RecordPaymentDialog } from '@/features/external-hiring/components/record-payment-dialog';
import { ExternalHiringReconciliation } from '@/features/external-hiring/components/reconciliation-tab';
import '@/shared/config/init-features';

export function ExternalHiringDetailView({ id }: { id: string }) {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [balanceDue, setBalanceDue] = useState(0);

  const config = featureRegistry.get('external-hiring');

  const extraActions = (data: Record<string, any>) => {
    const currentBalance = data.balance_due as number;
    return [
      {
        label: 'Record Payment',
        disabled: !currentBalance || currentBalance <= 0,
        onClick: () => {
          setBalanceDue(currentBalance || 0);
          setPaymentOpen(true);
        },
      },
    ];
  };

  return (
    <>
      <CrudDetails
        config={config}
        id={id}
        extraActions={extraActions}
        extensions={[
          {
            label: 'Reconciliation',
            content: <ExternalHiringReconciliation hiringId={id} />,
          },
        ]}
      />

      <RecordPaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        hiringId={id}
        balanceDue={balanceDue}
      />
    </>
  );
}
