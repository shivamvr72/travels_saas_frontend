import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default async function routesDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MetadataCrudView feature="routes" view="details" id={id} />;
}
