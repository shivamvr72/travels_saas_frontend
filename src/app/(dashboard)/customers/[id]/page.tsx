import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default function customersDetailsPage({ params }: { params: { id: string } }) {
  return <MetadataCrudView feature="customers" view="details" id={params.id} />;
}
