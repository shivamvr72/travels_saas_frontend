'use client';

import { useMemo } from 'react';
import { featureRegistry, FeatureKey } from '@/shared/config/feature-registry';
import { CrudList } from './crud-list';
import { CrudForm } from './crud-form';
import { CrudDetails } from './crud-details';

interface MetadataCrudViewProps {
  feature: FeatureKey;
  view: 'list' | 'form' | 'details';
  id?: string;
  isEditing?: boolean;
}

export function MetadataCrudView({ feature, view, id, isEditing }: MetadataCrudViewProps) {
  const config = useMemo(() => featureRegistry.get(feature), [feature]);

  switch (view) {
    case 'list':
      return <CrudList config={config} />;
    
    case 'form':
      return (
        <CrudForm config={config} isEditing={!!isEditing} id={id} />
      );
    
    case 'details':
      if (!id) throw new Error('Details view requires an id');
      return (
        <CrudDetails config={config} id={id}>
          {(data) => {
            // If the feature provides a custom layout, use it.
            // Otherwise we could auto-generate a generic details view from Form metadata
            if (config.detail?.customLayout) {
              return config.detail.customLayout(data);
            }
            return (
              <div className="p-6 bg-muted/20 border border-border rounded-lg text-muted-foreground">
                <p>Default Metadata Details View.</p>
                <p>Define config.detail.customLayout to override.</p>
                <pre className="mt-4 p-4 bg-background rounded overflow-auto text-xs text-foreground">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            );
          }}
        </CrudDetails>
      );
      
    default:
      return null;
  }
}
