import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default function EditcustomersPage({ params }: { params: { id: string } }) {
  return <MetadataCrudView feature="customers" view="form" id={params.id} isEditing />;
}
