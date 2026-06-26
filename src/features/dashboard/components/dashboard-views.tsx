import { ReactNode } from 'react';
import { AppStatGrid } from '@/components/layout/crud/app-stat-grid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Route, Bus, Users, Wallet, TrendingUp, TrendingDown, Clock, AlertTriangle, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KpiCardProps {
  title: string;
  value: ReactNode;
  icon: ReactNode;
  trend?: string;
  trendValue?: string;
  isPositive?: boolean;
}

function KpiCard({ title, value, icon, trend, trendValue, isPositive }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="h-4 w-4 text-muted-foreground">{icon}</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <p className="text-xs flex items-center gap-1">
              {isPositive ? <TrendingUp className="h-3 w-3 text-emerald-500" /> : <TrendingDown className="h-3 w-3 text-destructive" />}
              <span className={isPositive ? "text-emerald-500 font-medium" : "text-destructive font-medium"}>
                {trendValue}
              </span>
              <span className="text-muted-foreground ml-1">vs last week</span>
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
      {/* Row 1: Operations */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Today&apos;s Operations</h3>
        <AppStatGrid columns={4}>
          <KpiCard title="Today&apos;s Trips" value="24" icon={<Route />} trend="Up" trendValue="+12%" isPositive={true} />
          <KpiCard title="Vehicles Running" value="18 / 25" icon={<Bus />} trend="Up" trendValue="+2" isPositive={true} />
          <KpiCard title="Drivers Assigned" value="20" icon={<Users />} trend="Stable" trendValue="0" isPositive={true} />
          <KpiCard title="Today's Collections" value="₹45,200" icon={<Wallet />} trend="Up" trendValue="+5%" isPositive={true} />
        </AppStatGrid>
      </div>
      
      {/* Row 2: Financials */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Monthly Financials</h3>
        <AppStatGrid columns={4}>
          <KpiCard title="Monthly Revenue" value="₹12.4L" icon={<TrendingUp />} trend="Up" trendValue="+8%" isPositive={true} />
          <KpiCard title="Monthly Expenses" value="₹4.2L" icon={<TrendingDown />} trend="Down" trendValue="-2%" isPositive={true} />
          <KpiCard title="Outstanding Receivables" value="₹2.1L" icon={<AlertCircle />} trend="Up" trendValue="+₹45k" isPositive={false} />
          <KpiCard title="Vendor Payables" value="₹1.8L" icon={<Wallet />} trend="Down" trendValue="-₹20k" isPositive={true} />
        </AppStatGrid>
      </div>
    </div>
  );
}

export function DashboardAlertsRow() {
  return (
    <div className="mt-8">
      <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Action Items & Alerts</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Upcoming Trips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled for tomorrow</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-destructive" /> Vehicle Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1 text-destructive font-medium">Expiring within 7 days</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Driver Licenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground mt-1">Expiring within 15 days</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Pending Collections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting confirmation</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function DashboardBottomRow() {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Trips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-border/40 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Route className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Mumbai ⇄ Pune (Roundtrip)</p>
                    <p className="text-xs text-muted-foreground">Vehicle: MH12-AB1234 • Driver: Ramesh K.</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-500">
                    Completed
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">Today, 2:30 PM</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-border/40 pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">Customer: ABC Corp</p>
                  <p className="text-xs text-muted-foreground">Bank Transfer • Ref: 893452</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-500">+₹12,500</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">View All Transactions</Button>
        </CardContent>
      </Card>
    </div>
  );
}
