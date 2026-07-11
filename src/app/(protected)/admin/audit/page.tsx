'use client';

import { useAuditLogs } from '@/features/admin/hooks/use-admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function AdminAuditPage() {
  const { data: logs, isLoading } = useAuditLogs();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Audit Logs</h2>
        <p className="text-sm text-gray-500">Review system activity and security events.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Recent actions performed across the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-4 py-2">Timestamp</th>
                    <th className="px-4 py-2">Action</th>
                    <th className="px-4 py-2">Entity Type</th>
                    <th className="px-4 py-2">Entity ID</th>
                  </tr>
                </thead>
                <tbody>
                  {logs?.map((log) => (
                    <tr key={log.id} className="border-b">
                      <td className="px-4 py-3">{new Date(log.created_at).toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium text-indigo-600">{log.action}</td>
                      <td className="px-4 py-3">{log.entity_type}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{log.entity_id}</td>
                    </tr>
                  ))}
                  {logs?.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        No audit logs available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
