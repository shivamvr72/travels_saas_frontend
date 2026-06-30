import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default async function EditexpensesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MetadataCrudView feature="expenses" view="form" id={id} isEditing />;
}
