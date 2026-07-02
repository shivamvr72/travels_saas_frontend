import dynamic from 'next/dynamic';
import { AppLoadingState } from '@/components/shared/app-loading-state';

const TripWorkspace = dynamic(
  () => import('@/features/trips/workspace/trip-workspace').then(mod => ({ default: mod.TripWorkspace })),
  { loading: () => <AppLoadingState /> }
);

export default async function TripDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <TripWorkspace tripId={id} />;
}
