import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default function vehiclesDetailsPage({ params }: { params: { id: string } }) {
  return <MetadataCrudView feature="vehicles" view="details" id={params.id} />;
}
