import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default async function expensesDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MetadataCrudView feature="expenses" view="details" id={id} />;
}
