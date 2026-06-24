export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Architecture Status</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-primary">Foundation Ready</div>
            <p className="text-xs text-muted-foreground mt-1">
              FE-1 architectural blueprint implemented.
            </p>
          </div>
        </div>
      </div>
      
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <h3 className="text-lg font-medium mb-2">Next Steps</h3>
        <p className="text-sm text-muted-foreground">
          Ready to begin FE-2 (Authentication + Shell Layout).
        </p>
      </div>
    </div>
  );
}
