import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default function EditcompaniesPage({ params }: { params: { id: string } }) {
  return <MetadataCrudView feature="companies" view="form" id={params.id} isEditing />;
}
