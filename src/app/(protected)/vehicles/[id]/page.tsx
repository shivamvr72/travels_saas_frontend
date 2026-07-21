import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';
import { DocumentVault } from '@/components/shared/document-manager/document-vault';
import { ActivityTimeline } from '@/components/shared/activity-timeline';
import { ResourceAvailability } from '@/components/shared/resource-availability';
import { EntityNotifications } from '@/components/shared/entity-notifications';

export default async function vehiclesDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const extensions = [
    { label: 'Documents', content: <DocumentVault entityType="VEHICLE" entityId={id} /> },
    { label: 'Activity', content: <ActivityTimeline entityType="VEHICLE" entityId={id} /> },
    { label: 'Availability', content: <ResourceAvailability entityType="VEHICLE" entityId={id} /> },
    { label: 'Notifications', content: <EntityNotifications entityType="VEHICLE" entityId={id} /> }
  ];

  return <MetadataCrudView feature="vehicles" view="details" id={id} extensions={extensions} />;
}
