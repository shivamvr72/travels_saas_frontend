import { ReactNode } from 'react';
import { AppStatGrid } from '@/components/layout/crud/app-stat-grid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Route, Bus, Users, Wallet, TrendingUp, TrendingDown, Clock, AlertTriangle, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: ReactNode;
  icon: ReactNode;
  trend?: string;
  trendValue?: string;
  isPositive?: boolean;
  iconClassName?: string;
}

function KpiCard({ title, value, icon, trend, trendValue, isPositive, iconClassName = "bg-primary/10 text-primary" }: KpiCardProps) {
  return (
    <Card className="shadow-none border-border/50 transition-all hover:border-border/80">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-md", iconClassName)}>
            <div className="[&>svg]:h-4 [&>svg]:w-4">{icon}</div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          {trend && (
            <p className="text-xs flex items-center gap-1.5 mt-1">
              <span className={cn(
                "flex items-center rounded-sm px-1.5 py-0.5 font-medium",
                isPositive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-destructive/10 text-destructive"
              )}>
                {isPositive ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                {trendValue}
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardKpiCards() {
  return (
    <div className="space-y-6">
      <AppStatGrid columns={4}>
        <KpiCard 
          title="Today's Trips" 
          value="24" 
          icon={<Route />} 
          trend="Up" 
          trendValue="+12%" 
          isPositive={true} 
          iconClassName="bg-blue-500/10 text-blue-500" 
        />
        
        <Card className="shadow-none border-border/50 transition-all hover:border-border/80 bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-4">
              <p className="text-sm font-medium text-muted-foreground">Vehicles Running</p>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-500">
                <div className="[&>svg]:h-4 [&>svg]:w-4"><Bus /></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-bold tracking-tight">18 <span className="text-sm font-medium text-muted-foreground">/ 25</span></div>
              <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full mt-1">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '72%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <KpiCard 
          title="Drivers Assigned" 
          value="20" 
          icon={<Users />} 
          iconClassName="bg-violet-500/10 text-violet-500" 
        />
        
        <KpiCard 
          title="Outstanding Receivables" 
          value="₹2.1L" 
          icon={<AlertCircle />} 
          iconClassName="bg-amber-500/10 text-amber-500" 
          trend="Warning"
          trendValue="Pending Follow-up"
          isPositive={false}
        />
      </AppStatGrid>
    </div>
  );
}

export function DashboardMainContent() {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-5">
      {/* Active Trips (60% width on Desktop) */}
      <Card className="lg:col-span-3 shadow-none border-border/50 bg-card">
        <CardHeader className="border-b border-border/40 pb-4 pt-5">
          <CardTitle className="text-base font-semibold text-foreground">Active Trips</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/40">
            {[
              { route: 'Mumbai ⇄ Pune (Roundtrip)', status: 'IN PROGRESS', statusColor: 'bg-blue-500/10 text-blue-500', driver: 'RK' },
              { route: 'Bangalore ⇄ Chennai', status: 'COMPLETED', statusColor: 'bg-emerald-500/10 text-emerald-500', driver: 'S' },
              { route: 'Delhi ⇄ Jaipur', status: 'IN PROGRESS', statusColor: 'bg-blue-500/10 text-blue-500', driver: 'AJ' },
              { route: 'Hyderabad ⇄ Vijayawada', status: 'DELAYED', statusColor: 'bg-amber-500/10 text-amber-500', driver: 'MV' },
            ].map((trip, i) => (
              <div key={i} className="flex items-center justify-between p-5 hover:bg-muted/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {trip.driver}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{trip.route}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Vehicle: MH12-AB{1000 + i}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider", trip.statusColor)}>
                    {trip.status}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1.5">Today, 2:30 PM</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Payments (40% width on Desktop) */}
      <Card className="lg:col-span-2 shadow-none border-border/50 bg-card">
        <CardHeader className="border-b border-border/40 pb-4 pt-5">
          <CardTitle className="text-base font-semibold text-foreground">Recent Payments</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex flex-col h-[calc(100%-4rem)]">
          <div className="divide-y divide-border/40 flex-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-5 hover:bg-muted/10 transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground">Customer: ABC Corp</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Bank Transfer • Ref: 893452</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-500">+₹12,500</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border/40 mt-auto">
            <Button variant="outline" className="w-full bg-transparent shadow-none border-border/50 text-muted-foreground hover:text-foreground">View All Transactions</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
