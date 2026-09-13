import React, { useState } from 'react';
import { DriverAnalytics } from '../../domain/reports-types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ReportExportToolbar } from '../export/report-export-toolbar';
import { ArrowUpDown, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface DriverAnalyticsTableProps {
  data: DriverAnalytics[];
  isLoading: boolean;
}

type SortField = keyof DriverAnalytics;

export function DriverAnalyticsTable({ data, isLoading }: DriverAnalyticsTableProps) {
  const [sortField, setSortField] = useState<SortField>('ranking');
  const [sortDesc, setSortDesc] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortField(field);
      // Default to ascending for ranking, descending for everything else
      setSortDesc(field !== 'ranking');
    }
  };

  // Add a derived performance score for visual progress bar (normalized)
  const maxScore = data.length > 0 
    ? Math.max(...data.map(d => Math.sqrt(d.trips_completed * d.revenue_generated)))
    : 1;

  const enrichedData = data.map(d => ({
    ...d,
    score: Math.sqrt(d.trips_completed * d.revenue_generated),
    scorePct: maxScore > 0 ? (Math.sqrt(d.trips_completed * d.revenue_generated) / maxScore) * 100 : 0
  }));

  const sortedData = [...enrichedData].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (valA === valB) return 0;
    if (valA === undefined || valB === undefined) return 0;
    
    if (sortDesc) {
      return valA < valB ? 1 : -1;
    }
    return valA > valB ? 1 : -1;
  });

  const columns = [
    { header: 'Rank', key: 'ranking' },
    { header: 'Driver', key: 'driver_name' },
    { header: 'Trips Completed', key: 'trips_completed' },
    { header: 'Revenue Generated', key: 'revenue_generated' },
    { header: 'Avg Trip Duration (hrs)', key: 'avg_trip_duration_hours' },
    { header: 'Current Assignment', key: 'current_assignment' },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Driver Leaderboard</CardTitle>
            <CardDescription>Performance ranking across all drivers</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderRankBadge = (rank: number) => {
    if (rank === 1) return <div className="flex items-center gap-1 font-bold text-amber-500"><Award className="h-4 w-4" /> 1st</div>;
    if (rank === 2) return <div className="flex items-center gap-1 font-bold text-slate-400"><Award className="h-4 w-4" /> 2nd</div>;
    if (rank === 3) return <div className="flex items-center gap-1 font-bold text-amber-700"><Award className="h-4 w-4" /> 3rd</div>;
    return <span className="text-muted-foreground pl-5">{rank}</span>;
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <CardTitle>Driver Leaderboard</CardTitle>
          <CardDescription>Performance ranking across all drivers</CardDescription>
        </div>
        <ReportExportToolbar data={sortedData} columns={columns} filename="driver-leaderboard" />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('ranking')} className="h-8 flex items-center justify-start w-full gap-1 -ml-3">
                    Rank <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Driver</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('trips_completed')} className="h-8 flex items-center justify-end w-full gap-1">
                    Trips <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('revenue_generated')} className="h-8 flex items-center justify-end w-full gap-1">
                    Revenue <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="w-[200px] text-center">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Performance Score</span>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('avg_trip_duration_hours')} className="h-8 flex items-center justify-end w-full gap-1">
                    Avg Duration (h) <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Current Assignment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                    No driver performance data found for this period.
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((row) => (
                  <TableRow key={row.driver_id}>
                    <TableCell>{renderRankBadge(row.ranking)}</TableCell>
                    <TableCell className="font-medium">{row.driver_name}</TableCell>
                    <TableCell className="text-right">{row.trips_completed}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">{formatCurrency(row.revenue_generated)}</TableCell>
                    <TableCell>
                      <Progress 
                        value={row.scorePct} 
                        className="h-2 w-[150px] mx-auto" 
                      />
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {row.avg_trip_duration_hours ? row.avg_trip_duration_hours.toFixed(1) : '-'}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {row.current_assignment || 'Unassigned'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
