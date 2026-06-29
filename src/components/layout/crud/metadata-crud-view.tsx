'use client';

import { useMemo } from 'react';
import '@/shared/config/init-features';
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
      return <CrudDetails config={config} id={id} />;
      
    default:
      return null;
  }
}
