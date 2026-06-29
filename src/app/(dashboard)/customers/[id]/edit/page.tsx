import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default async function ({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <MetadataCrudView feature="customers" view="form" id={resolvedParams.id} isEditing />;
}
