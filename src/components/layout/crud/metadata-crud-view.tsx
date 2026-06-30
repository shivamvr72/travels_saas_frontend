'use client';

import { useMemo } from 'react';
import '@/shared/config/init-features';
import { featureRegistry, FeatureKey } from '@/shared/config/feature-registry';
import { CrudList } from './crud-list';
import { CrudForm } from './crud-form';
import { CrudDetails } from './crud-details';
import { AppPageContainer } from './app-page-container';
import { AppToolbar } from './app-toolbar';
import { Card, CardContent } from '@/components/ui/card';
import { Construction } from 'lucide-react';

interface MetadataCrudViewProps {
  feature: FeatureKey;
  view: 'list' | 'form' | 'details';
  id?: string;
  isEditing?: boolean;
}

export function MetadataCrudView({ feature, view, id, isEditing }: MetadataCrudViewProps) {
  const config = useMemo(() => {
    try {
      return featureRegistry.get(feature);
    } catch (e) {
      return null;
    }
  }, [feature]);

  if (!config) {
    return (
      <AppPageContainer>
        <AppToolbar title={feature.charAt(0).toUpperCase() + feature.slice(1).replace('-', ' ')} />
        <Card className="mt-8 border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <Construction className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
            <p className="text-muted-foreground max-w-md">
              The {feature.replace('-', ' ')} feature is currently under development. Please check back later!
            </p>
          </CardContent>
        </Card>
      </AppPageContainer>
    );
  }

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
