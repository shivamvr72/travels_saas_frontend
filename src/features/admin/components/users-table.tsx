'use client';

import { useState } from 'react';
import { useAdminUsers, useAdminUserUpdate, useAdminPasswordReset } from '@/features/admin/hooks/use-admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, MoreVertical, ShieldAlert, KeyRound, Lock, Unlock, CheckCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

export function UsersTable() {
  const [search, setSearch] = useState('');
  const { data: users, isLoading } = useAdminUsers(search);
  const updateUser = useAdminUserUpdate();
  const resetPassword = useAdminPasswordReset();

  const handleToggleLock = (userId: string, isLocked: boolean) => {
    updateUser.mutate(
      { id: userId, payload: { status: isLocked ? 'active' : 'locked' } },
      {
        onSuccess: () => toast.success(`User ${isLocked ? 'unlocked' : 'locked'} successfully`),
        onError: () => toast.error('Failed to update user status')
      }
    );
  };

  const handleResetPassword = (userId: string) => {
    // In a real app, this would open a dialog to input new password or auto-generate one
    const tempPassword = 'TempPassword123!';
    resetPassword.mutate(
      { id: userId, password: tempPassword, force: true },
      {
        onSuccess: () => toast.success(`Password reset to: ${tempPassword}`),
        onError: () => toast.error('Failed to reset password')
      }
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Users</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 uppercase">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr key={user.id} className="border-b bg-white">
                    <td className="px-6 py-4 font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="capitalize">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {user.status === 'locked' ? (
                        <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                          <Lock className="h-3 w-3" /> Locked
                        </Badge>
                      ) : user.status === 'inactive' ? (
                        <Badge variant="secondary">Inactive</Badge>
                      ) : (
                        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1 w-fit">
                          <CheckCircle className="h-3 w-3" /> Active
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        } />
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                            <KeyRound className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === 'locked' ? (
                            <DropdownMenuItem onClick={() => handleToggleLock(user.id, true)}>
                              <Unlock className="mr-2 h-4 w-4 text-green-600" />
                              Unlock User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleToggleLock(user.id, false)}>
                              <Lock className="mr-2 h-4 w-4 text-red-600" />
                              Lock User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {users?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
