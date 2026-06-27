import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default function EditroutesPage({ params }: { params: { id: string } }) {
  return <MetadataCrudView feature="routes" view="form" id={params.id} isEditing />;
}
