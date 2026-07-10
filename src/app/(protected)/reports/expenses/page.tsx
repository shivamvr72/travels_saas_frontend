import React from 'react';
import { Construction } from 'lucide-react';

export default function ExpenseAnalyticsUpcomingPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4 p-8 text-center">
      <div className="rounded-full bg-primary/10 p-4">
        <Construction className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Expense Analytics Coming Soon</h1>
      <p className="max-w-md text-muted-foreground">
        This reporting module is currently under development. Stay tuned for advanced analytics and insights.
      </p>
    </div>
  );
}
