import React, { useState } from 'react';
import { DriverProfitRow } from '../../domain/reports-types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ReportExportToolbar } from '../export/report-export-toolbar';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface DriverProfitTableProps {
  data: DriverProfitRow[];
  isLoading: boolean;
}

type SortField = keyof DriverProfitRow;

export function DriverProfitTable({ data, isLoading }: DriverProfitTableProps) {
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
    { header: 'Driver', key: 'driver_name' },
    { header: 'Revenue', key: 'revenue' },
    { header: 'Expenses', key: 'expenses' },
    { header: 'Net Profit', key: 'profit' },
    { header: 'Margin %', key: 'margin_pct' },
    { header: 'Trips', key: 'trips' },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Driver Profitability</CardTitle>
            <CardDescription>Breakdown of profit by driver</CardDescription>
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
          <CardTitle>Driver Profitability</CardTitle>
          <CardDescription>Breakdown of profit by driver</CardDescription>
        </div>
        <ReportExportToolbar data={sortedData} columns={columns} filename="driver-profitability" />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
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
                    Net Profit <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="w-[150px] text-center">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('margin_pct')} className="h-8 flex items-center justify-center w-full gap-1">
                    Margin % <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('trips')} className="h-8 flex items-center justify-end w-full gap-1">
                    Trips <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    No driver profitability data found for this period.
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((row) => (
                  <TableRow key={row.driver_id}>
                    <TableCell className="font-medium">{row.driver_name}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatCurrency(row.revenue)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatCurrency(row.expenses)}</TableCell>
                    <TableCell className={cn("text-right font-semibold", row.profit < 0 ? "text-destructive" : "text-primary")}>
                      {formatCurrency(row.profit)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="w-10 text-right text-xs">{row.margin_pct.toFixed(1)}%</span>
                        <Progress 
                          value={Math.min(Math.max(row.margin_pct, 0), 100)} 
                          className={cn(
                            "h-2", 
                            row.margin_pct >= 25 ? "[&>div]:bg-green-500" : row.margin_pct >= 10 ? "[&>div]:bg-amber-500" : "[&>div]:bg-destructive"
                          )} 
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{row.trips}</TableCell>
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
