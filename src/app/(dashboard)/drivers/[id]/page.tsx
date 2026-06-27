import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default function driversDetailsPage({ params }: { params: { id: string } }) {
  return <MetadataCrudView feature="drivers" view="details" id={params.id} />;
}
