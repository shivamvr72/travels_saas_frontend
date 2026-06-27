import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default function companiesDetailsPage({ params }: { params: { id: string } }) {
  return <MetadataCrudView feature="companies" view="details" id={params.id} />;
}
