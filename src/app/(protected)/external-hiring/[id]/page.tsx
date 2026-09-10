import { ExternalHiringDetailView } from '@/features/external-hiring/components/external-hiring-detail-view';

export default async function ExternalHiringDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ExternalHiringDetailView id={id} />;
}
