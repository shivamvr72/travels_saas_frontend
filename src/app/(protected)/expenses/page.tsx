import { MetadataCrudView } from '@/components/layout/crud/metadata-crud-view';

export default function expensesListPage() {
  return <MetadataCrudView feature="expenses" view="list" />;
}
