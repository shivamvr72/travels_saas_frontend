import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default async function EditroutesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MetadataCrudView feature="routes" view="form" id={id} isEditing />;
}
