import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default async function EditsettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MetadataCrudView feature="settings" view="form" id={id} isEditing />;
}
