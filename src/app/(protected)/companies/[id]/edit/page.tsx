import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default async function EditcompaniesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MetadataCrudView feature="companies" view="form" id={id} isEditing />;
}
