import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default async function vehiclesDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MetadataCrudView feature="vehicles" view="details" id={id} />;
}
