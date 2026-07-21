import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';
import { DocumentVault } from '@/components/shared/document-manager/document-vault';
import { ActivityTimeline } from '@/components/shared/activity-timeline';
import { ResourceAvailability } from '@/components/shared/resource-availability';
import { EntityNotifications } from '@/components/shared/entity-notifications';

export default async function driversDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const extensions = [
    { label: 'Documents', content: <DocumentVault entityType="DRIVER" entityId={id} /> },
    { label: 'Activity', content: <ActivityTimeline entityType="DRIVER" entityId={id} /> },
    { label: 'Availability', content: <ResourceAvailability entityType="DRIVER" entityId={id} /> },
    { label: 'Notifications', content: <EntityNotifications entityType="DRIVER" entityId={id} /> }
  ];

  return <MetadataCrudView feature="drivers" view="details" id={id} extensions={extensions} />;
}
