import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default async function driversDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MetadataCrudView feature="drivers" view="details" id={id} />;
}
