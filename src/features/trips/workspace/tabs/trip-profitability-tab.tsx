import { useState, useEffect } from 'react';
import { Trip } from '../../domain/trip-types';
import { ProfitabilitySummary } from '@/features/finance/domain/finance-types';
import { ProfitabilityService } from '@/features/finance/services/profitability.service';
import { ProfitCard } from '@/features/finance/components/profit-card';
import { AppLoadingState } from '@/components/shared/app-loading-state';
import { InfoIcon } from 'lucide-react';

interface TripProfitabilityTabProps {
  trip: Trip;
}

export function TripProfitabilityTab({ trip }: TripProfitabilityTabProps) {
  const [summary, setSummary] = useState<ProfitabilitySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfitability = async () => {
      try {
        const data = await ProfitabilityService.getTripProfitability(trip.id);
        setSummary(data);
      } catch (error) {
        console.error('Failed to fetch profitability', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfitability();
  }, [trip.id]);

  if (isLoading) return <AppLoadingState />;

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-6">
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4 flex gap-3 text-blue-800 dark:text-blue-300">
        <InfoIcon className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="text-sm space-y-1">
          <p className="font-semibold">Dynamic Profitability Tracking</p>
          <p>
            This tab calculates profitability in real-time. It uses the trip's subtotal from the invoice 
            as Gross Revenue, and the sum of all recorded trip expenses as Total Expenses.
          </p>
        </div>
      </div>

      {summary && <ProfitCard summary={summary} />}
    </div>
  );
}
