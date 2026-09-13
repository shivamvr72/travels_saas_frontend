import React, { useState } from 'react';
import { FleetSummary } from '../../domain/reports-types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ReportExportToolbar } from '../export/report-export-toolbar';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VEHICLE_STATUS_COLORS } from '../../domain/reports-constants';
import { Progress } from '@/components/ui/progress';

interface FleetSummaryTableProps {
  data: FleetSummary[];
  isLoading: boolean;
}

type SortField = keyof FleetSummary;

export function FleetSummaryTable({ data, isLoading }: FleetSummaryTableProps) {
  const [sortField, setSortField] = useState<SortField>('profit');
  const [sortDesc, setSortDesc] = useState(true);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortField(field);
      setSortDesc(true);
    }
  };

  const sortedData = [...data].sort((a, b) => {
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
    { header: 'Vehicle', key: 'reg_number' },
    { header: 'Status', key: 'status' },
    { header: 'Trips', key: 'trips' },
    { header: 'Revenue', key: 'revenue' },
    { header: 'Expenses', key: 'expenses' },
    { header: 'Profit', key: 'profit' },
    { header: 'Utilization %', key: 'utilization_pct' },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Fleet Performance</CardTitle>
            <CardDescription>Detailed metrics by vehicle</CardDescription>
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

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <CardTitle>Fleet Performance</CardTitle>
          <CardDescription>Detailed metrics by vehicle</CardDescription>
        </div>
        <ReportExportToolbar data={sortedData} columns={columns} filename="fleet-performance" />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('status')} className="h-8 flex items-center gap-1">
                    Status <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('trips')} className="h-8 flex items-center justify-end w-full gap-1">
                    Trips <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('revenue')} className="h-8 flex items-center justify-end w-full gap-1">
                    Revenue <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('expenses')} className="h-8 flex items-center justify-end w-full gap-1">
                    Expenses <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('profit')} className="h-8 flex items-center justify-end w-full gap-1">
                    Profit <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="w-[150px]">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('utilization_pct')} className="h-8 flex items-center w-full gap-1">
                    Utilization <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                    No vehicle data found for this period.
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((row) => (
                  <TableRow key={row.vehicle_id}>
                    <TableCell className="font-medium">
                      {row.reg_number}
                      {row.vehicle_name && <span className="text-muted-foreground text-xs block">{row.vehicle_name}</span>}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        style={{ 
                          borderColor: VEHICLE_STATUS_COLORS[row.status.toLowerCase()] || VEHICLE_STATUS_COLORS.inactive,
                          color: VEHICLE_STATUS_COLORS[row.status.toLowerCase()] || VEHICLE_STATUS_COLORS.inactive,
                          backgroundColor: `${VEHICLE_STATUS_COLORS[row.status.toLowerCase()] || VEHICLE_STATUS_COLORS.inactive}15`
                        }}
                      >
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{row.trips}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatCurrency(row.revenue)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatCurrency(row.expenses)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(row.profit)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm w-8">{row.utilization_pct.toFixed(0)}%</span>
                        <Progress 
                          value={row.utilization_pct} 
                          className="h-2"
                          indicatorClassName={
                            row.utilization_pct < 50 ? 'bg-destructive' :
                            row.utilization_pct < 75 ? 'bg-warning' : 'bg-success'
                          }
                        />
                      </div>
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
