import { DispatchPage } from '@/features/dispatch/pages/dispatch-page';
import { RequirePermission } from '@/shared/permissions/require-permission';

export default function Page() {
  return (
    <RequirePermission roles={['admin', 'manager', 'viewer']}>
      <DispatchPage />
    </RequirePermission>
  );
}
