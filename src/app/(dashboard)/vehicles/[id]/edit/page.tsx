import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default function EditvehiclesPage({ params }: { params: { id: string } }) {
  return <MetadataCrudView feature="vehicles" view="form" id={params.id} isEditing />;
}
