import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default async function externalhiringDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MetadataCrudView feature="external-hiring" view="details" id={id} />;
}
