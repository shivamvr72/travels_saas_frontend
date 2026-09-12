import { useRouter } from 'next/navigation';
import { CURRENCY_CONFIG } from '../domain/finance-constants';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { CustomerOutstandingItem } from '../domain/finance-types';

interface CustomerOutstandingSummaryProps {
  data: CustomerOutstandingItem[];
  onSelectCustomer?: (customer: CustomerOutstandingItem) => void;
}

export function CustomerOutstandingSummary({ data, onSelectCustomer }: CustomerOutstandingSummaryProps) {
  const router = useRouter();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
      style: 'currency',
      currency: CURRENCY_CONFIG.currency,
    }).format(amount);
  };

  const handleRowClick = (item: CustomerOutstandingItem) => {
    if (onSelectCustomer) {
      onSelectCustomer(item);
    } else {
      router.push(`/finance/receivables/${item.id}`);
    }
  };

  return (
    <>
      <div className="bg-card text-card-foreground rounded-lg border shadow-sm overflow-hidden mt-6">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Customer Outstanding Balances</h3>
          <p className="text-sm text-muted-foreground mt-1">Pending payments grouped by customer or corporate client</p>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer / Client</TableHead>
                <TableHead className="text-center">Pending Invoices</TableHead>
                <TableHead className="text-center">Overdue</TableHead>
                <TableHead className="text-right">Total Outstanding</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No outstanding balances found.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow 
                    key={item.id}
                    onClick={() => handleRowClick(item)}
                    className="cursor-pointer hover:bg-muted/60 transition-colors group"
                  >
                    <TableCell className="font-medium group-hover:text-primary transition-colors">{item.name}</TableCell>
                    <TableCell className="text-center">{item.total_invoices}</TableCell>
                    <TableCell className="text-center">
                      {item.overdue_invoices > 0 ? (
                        <span className="text-red-600 dark:text-red-400 font-semibold">{item.overdue_invoices}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-bold text-amber-600 dark:text-amber-500">
                      {formatCurrency(item.total_outstanding)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 group-hover:translate-x-0.5 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(item);
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
