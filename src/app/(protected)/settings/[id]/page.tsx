import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default async function settingsDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MetadataCrudView feature="settings" view="details" id={id} />;
}
