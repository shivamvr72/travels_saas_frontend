import { TopEntityResponse } from '../domain/analytics-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface TopCustomersTableProps {
  data: TopEntityResponse[];
  isLoading: boolean;
}

export function TopCustomersTable({ data, isLoading }: TopCustomersTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <Card className="col-span-1 md:col-span-2 border-muted/40 shadow-sm bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Top Customers</CardTitle>
          <CardDescription>Highest revenue generating clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center py-3 animate-pulse border-b border-border/40 last:border-0">
                <div className="h-4 bg-muted/50 rounded-full w-1/4"></div>
                <div className="h-4 bg-muted/50 rounded-full w-1/6"></div>
                <div className="h-4 bg-muted/50 rounded-full w-1/6"></div>
                <div className="h-4 bg-muted/50 rounded-full w-1/6"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 md:col-span-2 border shadow-sm hover:shadow-md transition-shadow duration-300 bg-card font-sans group">
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight">Top Customers</CardTitle>
        <CardDescription>Highest revenue generating clients</CardDescription>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-muted-foreground">Customer</TableHead>
                  <TableHead className="text-right font-semibold text-muted-foreground">Trips</TableHead>
                  <TableHead className="text-right font-semibold text-muted-foreground">Total Revenue</TableHead>
                  <TableHead className="text-right font-semibold text-muted-foreground">Net Profit</TableHead>
                  <TableHead className="text-right font-semibold text-muted-foreground">Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((customer) => (
                  <TableRow key={customer.entity_id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-bold">
                      <Link href={`/customers/${customer.entity_id}`} className="hover:text-primary transition-colors">
                        {customer.entity_name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right font-medium text-muted-foreground">{customer.total_trips}</TableCell>
                    <TableCell className="text-right font-black">{formatCurrency(customer.total_revenue)}</TableCell>
                    <TableCell className="text-right font-medium text-muted-foreground">{formatCurrency(customer.net_profit)}</TableCell>
                    <TableCell className="text-right">
                      {customer.margin_pct !== null ? (
                        <Badge 
                          variant="outline"
                          className={
                            customer.margin_pct > 20 
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" 
                              : customer.margin_pct > 0 
                                ? "border-blue-500/30 bg-blue-500/10 text-blue-500" 
                                : "border-rose-500/30 bg-rose-500/10 text-rose-500"
                          }
                        >
                          {customer.margin_pct.toFixed(1)}%
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-xl bg-muted/10">
            <span className="font-medium text-lg">No customer data available</span>
            <span className="text-sm mt-1 opacity-70">There is no revenue data for this period.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
