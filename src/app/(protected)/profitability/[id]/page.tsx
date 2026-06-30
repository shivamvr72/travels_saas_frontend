import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default async function profitabilityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MetadataCrudView feature="profitability" view="details" id={id} />;
}
