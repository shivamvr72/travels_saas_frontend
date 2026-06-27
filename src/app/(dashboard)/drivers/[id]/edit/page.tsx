import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default function EditdriversPage({ params }: { params: { id: string } }) {
  return <MetadataCrudView feature="drivers" view="form" id={params.id} isEditing />;
}
