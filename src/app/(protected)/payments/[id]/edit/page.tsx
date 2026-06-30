import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default async function EditpaymentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MetadataCrudView feature="payments" view="form" id={id} isEditing />;
}
