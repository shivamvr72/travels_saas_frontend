import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default async function EditcustomersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MetadataCrudView feature="customers" view="form" id={id} isEditing />;
}
