import React, { useState } from 'react';
import { VehicleExpenseRow } from '../../domain/reports-types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ReportExportToolbar } from '../export/report-export-toolbar';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VehicleExpenseTableProps {
  data: VehicleExpenseRow[];
  isLoading: boolean;
}

type SortField = keyof VehicleExpenseRow;

export function VehicleExpenseTable({ data, isLoading }: VehicleExpenseTableProps) {
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
    { header: 'Vehicle', key: 'reg_number' },
    { header: 'Total Expenses', key: 'total_expenses' },
    { header: 'Fuel', key: 'fuel' },
    { header: 'Maintenance', key: 'maintenance' },
    { header: 'Toll', key: 'toll' },
    { header: 'Driver Allowance', key: 'driver_allowance' },
    { header: 'Trips', key: 'trips' },
    { header: 'Cost / Trip', key: 'cost_per_trip' },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Vehicle Costs</CardTitle>
            <CardDescription>Breakdown of expenses by vehicle</CardDescription>
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
          <CardTitle>Vehicle Costs</CardTitle>
          <CardDescription>Breakdown of expenses by vehicle</CardDescription>
        </div>
        <ReportExportToolbar data={sortedData} columns={columns} filename="vehicle-expenses" />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('total_expenses')} className="h-8 flex items-center justify-end w-full gap-1">
                    Total Expenses <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('fuel')} className="h-8 flex items-center justify-end w-full gap-1">
                    Fuel <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('maintenance')} className="h-8 flex items-center justify-end w-full gap-1">
                    Maintenance <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('toll')} className="h-8 flex items-center justify-end w-full gap-1">
                    Toll <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('driver_allowance')} className="h-8 flex items-center justify-end w-full gap-1">
                    Allowance <ArrowUpDown className="h-3 w-3" />
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
                  <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                    No vehicle expenses found for this period.
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((row) => (
                  <TableRow key={row.vehicle_id}>
                    <TableCell className="font-medium">
                      {row.reg_number}
                      {row.vehicle_name && <span className="text-muted-foreground text-xs block">{row.vehicle_name}</span>}
                    </TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(row.total_expenses)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.fuel)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.maintenance)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.toll)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.driver_allowance)}</TableCell>
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
