import { useQuery } from '@tanstack/react-query';

// In FE-3, this will call an actual API endpoint.
// For now, it returns realistic placeholder data for the dashboard shell.
const fetchDashboardStats = async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    kpis: {
      activeTrips: 24,
      activeTripsTrend: { value: '12%', direction: 'up' as const },
      monthlyRevenue: '$45,231',
      monthlyRevenueTrend: { value: '8%', direction: 'up' as const },
      outstandingPayments: '$12,450',
      outstandingPaymentsTrend: { value: '2%', direction: 'down' as const },
      netProfit: '$18,900',
      netProfitTrend: { value: '4%', direction: 'up' as const },
    },
    operations: {
      upcomingTrips: 15,
      activeVehicles: 42,
      assignedDrivers: 38,
      externalHired: 4,
    },
    financials: {
      receivables: '$28,450',
      payables: '$15,200',
      monthlyExpenses: '$26,331',
      collectionRate: '85%',
    },
    alerts: [
      { id: '1', type: 'warning' as const, message: '3 vehicles have documents expiring within 30 days.' },
      { id: '2', type: 'destructive' as const, message: 'Driver license for John Doe expires tomorrow.' },
      { id: '3', type: 'warning' as const, message: '5 trips have pending payments over 15 days.' },
    ],
  };
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
  });
};
