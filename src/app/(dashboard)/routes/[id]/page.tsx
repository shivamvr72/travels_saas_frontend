import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default function routesDetailsPage({ params }: { params: { id: string } }) {
  return <MetadataCrudView feature="routes" view="details" id={params.id} />;
}
