import { TripCreateForm } from '../components/trip-create-form';
import { AppToolbar } from '@/components/layout/crud/app-toolbar';
import { Card, CardContent } from '@/components/ui/card';

export function TripCreatePage() {
  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10">
      <AppToolbar
        title="New Trip"
        description="Create a new trip and assign resources."
      />
      <Card>
        <CardContent className="pt-6">
          <TripCreateForm />
        </CardContent>
      </Card>
    </div>
  );
}
