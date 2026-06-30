import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default async function EdittripsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MetadataCrudView feature="trips" view="form" id={id} isEditing />;
}
