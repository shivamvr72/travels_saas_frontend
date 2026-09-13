import React, { useState } from 'react';
import { DriverExpenseRow } from '../../domain/reports-types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ReportExportToolbar } from '../export/report-export-toolbar';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DriverExpenseTableProps {
  data: DriverExpenseRow[];
  isLoading: boolean;
}

type SortField = keyof DriverExpenseRow;

export function DriverExpenseTable({ data, isLoading }: DriverExpenseTableProps) {
  const [sortField, setSortField] = useState<SortField>('total_expenses');
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
    { header: 'Driver Name', key: 'driver_name' },
    { header: 'Total Expenses', key: 'total_expenses' },
    { header: 'Allowances', key: 'allowances' },
    { header: 'Trips', key: 'trips' },
    { header: 'Cost / Trip', key: 'cost_per_trip' },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Driver Costs</CardTitle>
            <CardDescription>Breakdown of expenses by driver</CardDescription>
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
          <CardTitle>Driver Costs</CardTitle>
          <CardDescription>Breakdown of expenses by driver</CardDescription>
        </div>
        <ReportExportToolbar data={sortedData} columns={columns} filename="driver-expenses" />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver Name</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('total_expenses')} className="h-8 flex items-center justify-end w-full gap-1">
                    Total Expenses <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('allowances')} className="h-8 flex items-center justify-end w-full gap-1">
                    Allowances <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('trips')} className="h-8 flex items-center justify-end w-full gap-1">
                    Trips <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('cost_per_trip')} className="h-8 flex items-center justify-end w-full gap-1">
                    Cost / Trip <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No driver expenses found for this period.
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((row) => (
                  <TableRow key={row.driver_id}>
                    <TableCell className="font-medium">{row.driver_name}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(row.total_expenses)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.allowances)}</TableCell>
                    <TableCell className="text-right">{row.trips}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(row.cost_per_trip)}</TableCell>
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
