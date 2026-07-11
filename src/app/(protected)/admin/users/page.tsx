import { UsersTable } from '@/features/admin/components/users-table';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
        <p className="text-sm text-gray-500">View and manage all users within your organization.</p>
      </div>
      <UsersTable />
    </div>
  );
}
