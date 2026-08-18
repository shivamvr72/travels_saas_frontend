'use client';

import React, { useState, useEffect } from 'react';
import { ProfitabilitySummary } from '@/features/finance/domain/finance-types';
import { ProfitabilityService } from '@/features/finance/services/profitability.service';
import { ProfitCard } from '@/features/finance/components/profit-card';
import { AppLoadingState } from '@/components/shared/app-loading-state';

interface ProfitabilitySummaryCardProps {
  tripId: string;
}

export function ProfitabilitySummaryCard({ tripId }: ProfitabilitySummaryCardProps) {
  const [summary, setSummary] = useState<ProfitabilitySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfitability = async () => {
      try {
        const data = await ProfitabilityService.getTripProfitability(tripId);
        setSummary(data);
      } catch (error) {
        console.error('Failed to fetch profitability', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfitability();
  }, [tripId]);

  if (isLoading) return <AppLoadingState />;
  if (!summary) return null;

  return <ProfitCard summary={summary} />;
}
