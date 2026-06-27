import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatRelativeDate } from '@/shared/utils';

interface AppAuditInfoProps {
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string;
  deletedBy?: string;
  version?: number;
}

export function AppAuditInfo({
  createdAt,
  updatedAt,
  createdBy,
  updatedBy,
  deletedAt,
  deletedBy,
  version,
}: AppAuditInfoProps) {
  return (
    <Card className="mt-8 bg-muted/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          <span>Audit Information</span>
          {version !== undefined && (
            <span className="text-xs bg-muted px-2 py-1 rounded">v{version}</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
          <div>
            <span className="block font-medium mb-1">Created By</span>
            <span>{createdBy || 'System'}</span>
          </div>
          <div>
            <span className="block font-medium mb-1">Created At</span>
            <span title={formatDate(createdAt)}>{formatRelativeDate(createdAt)}</span>
          </div>
          <div>
            <span className="block font-medium mb-1">Last Updated By</span>
            <span>{updatedBy || '-'}</span>
          </div>
          <div>
            <span className="block font-medium mb-1">Last Updated At</span>
            <span title={formatDate(updatedAt)}>{formatRelativeDate(updatedAt)}</span>
          </div>
          
          {deletedAt && (
            <>
              <div>
                <span className="block font-medium mb-1 text-destructive">Deleted By</span>
                <span>{deletedBy || 'System'}</span>
              </div>
              <div>
                <span className="block font-medium mb-1 text-destructive">Deleted At</span>
                <span title={formatDate(deletedAt)}>{formatRelativeDate(deletedAt)}</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
