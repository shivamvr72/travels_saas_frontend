 
'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { CrudModuleConfig } from './crud-types';
import { AppPageContainer } from './app-page-container';
import { AppToolbar, ActionDef } from './app-toolbar';
import { DetailsSkeleton } from '@/components/shared/skeletons/details-skeleton';
import { AppAuditInfo } from '@/components/shared/app-audit-info';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatDateTime, formatCurrency, formatPercentage } from '@/shared/utils';
import { AppStatusBadge } from '@/components/shared/app-status-badge';
import { useConfirmDialog } from '@/shared/hooks';
import { AppConfirmDialog } from '@/components/shared';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CrudDetailsProps {
  config: CrudModuleConfig<unknown, unknown, unknown, unknown>;
  id: string;
  children?: (data: Record<string, any>) => ReactNode;
  extraActions?: (data: Record<string, any>) => ActionDef[];
  extensions?: { label: string; content: ReactNode }[];
}

function renderFieldValue(field: { name: string, type?: string, label?: string, renderDetail?: (data: Record<string, any>) => ReactNode }, data: Record<string, any>) {
  if (field.renderDetail) return field.renderDetail(data);
  const value = data[field.name];
  if (value === null || value === undefined) return '-';
  
  if (field.type === 'currency') return formatCurrency(value as number);
  if (field.type === 'percentage') return formatPercentage(value as number);
  if (field.type === 'date') return formatDate(value as string);
  if (field.type === 'datetime') return formatDateTime(value as string);
  if (field.type === 'status' || field.type === 'badge') return <AppStatusBadge status={value as string} size="sm" />;
  if (field.type === 'boolean' || field.type === 'switch' || field.type === 'checkbox') return value ? 'Yes' : 'No';
  
  return String(value);
}

export function CrudDetails({ config, id, children, extraActions, extensions }: CrudDetailsProps) {
  const router = useRouter();
  const { openDialog, ...confirmDialog } = useConfirmDialog();

  const { data, isLoading, error } = config.hooks.useDetail(id);
  const deleteMutation = config.hooks.useDelete();

  const handleEdit = () => {
    router.push(`${config.routeBase}/${id}/edit`);
  };

  const handleDelete = () => {
    if (!deleteMutation) return;
    openDialog({
      title: `Delete ${config.entityName}`,
      description: `Are you sure you want to delete this ${config.entityName.toLowerCase()}? This action cannot be undone.`,
      confirmLabel: 'Delete',
      isDestructive: true,
      onConfirm: async () => {
        await deleteMutation.mutateAsync(id);
        router.push(config.routeBase);
      }
    });
  };

  if (isLoading) {
    return <DetailsSkeleton />;
  }

  if (error || !data) {
    return (
      <AppPageContainer>
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
          <h2 className="text-2xl font-bold text-destructive">Error Loading Details</h2>
          <p className="text-muted-foreground">{error?.message || 'Item not found'}</p>
        </div>
      </AppPageContainer>
    );
  }

  const secondaryActions: ActionDef[] = [
    ...(extraActions ? extraActions(data as Record<string, any>) : []),
    ...(deleteMutation ? [{
      label: 'Delete',
      onClick: handleDelete,
      destructive: true,
    }] : [])
  ];

  const detailMetadata = config.detail?.metadata || (config.form?.sections ? {
    showAuditInfo: true,
    cards: config.form.sections.map(section => ({
      title: section.title,
      fields: section.fields.map(field => ({
        name: field.name,
        label: field.label || field.name,
        type: field.type,
      }))
    }))
  } : undefined);

  return (
    <AppPageContainer>
      <AppToolbar
        title={`${config.entityName} Details`}
        primaryAction={{
          label: 'Edit',
          onClick: handleEdit,
        }}
        secondaryActions={secondaryActions}
      />
      
      <div className="mt-6 space-y-6">
        {children ? (
          children(data as Record<string, any>)
        ) : config.detail?.customLayout ? (
          config.detail.customLayout(data as Record<string, any>)
        ) : detailMetadata ? (
          <>
            {detailMetadata.cards.map((card, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {card.fields.map(field => (
                      <div key={field.name}>
                        <dt className="text-sm font-medium text-muted-foreground mb-1">{field.label}</dt>
                        <dd className="text-sm font-medium">
                          {renderFieldValue(field, data as Record<string, any>)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            ))}
            
            {detailMetadata.showAuditInfo !== false && (
              <AppAuditInfo 
                createdAt={(data as Record<string, any>).created_at as string} 
                updatedAt={(data as Record<string, any>).updated_at as string} 
                createdBy={(data as Record<string, any>).created_by as string} 
                updatedBy={(data as Record<string, any>).updated_by as string} 
                version={(data as Record<string, any>).version as number}
              />
            )}
          </>
        ) : (
          <div className="p-4 border border-destructive/20 bg-destructive/5 text-destructive rounded-md">
            No detail layout configuration provided for {config.entityName}.
          </div>
        )}
      </div>

      {extensions && extensions.length > 0 && (
        <div className="mt-6">
          <Tabs defaultValue={extensions[0].label}>
            <TabsList className="mb-4">
              {extensions.map(ext => (
                <TabsTrigger key={ext.label} value={ext.label}>
                  {ext.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {extensions.map(ext => (
              <TabsContent key={ext.label} value={ext.label}>
                {ext.content}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}

      <AppConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.closeDialog}
        title={confirmDialog.config?.title || ''}
        description={confirmDialog.config?.description || ''}
        onConfirm={confirmDialog.config?.onConfirm || (() => {})}
        confirmLabel={confirmDialog.config?.confirmLabel}
        cancelLabel={confirmDialog.config?.cancelLabel}
        isDestructive={confirmDialog.config?.isDestructive}
      />
    </AppPageContainer>
  );
}
