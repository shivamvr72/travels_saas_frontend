import { ReactNode } from 'react';
import { Building2, Bus, Users, Route, Wallet, BarChart3, CheckCircle2 } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const features = [
    { icon: <Route className="h-5 w-5" />, label: "Trips" },
    { icon: <Bus className="h-5 w-5" />, label: "Fleet" },
    { icon: <Users className="h-5 w-5" />, label: "Drivers & Customers" },
    { icon: <Wallet className="h-5 w-5" />, label: "Finance & Payments" },
    { icon: <BarChart3 className="h-5 w-5" />, label: "Profitability" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Brand Panel (Hidden on mobile) */}
      <div className="hidden w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex relative overflow-hidden">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}>
        </div>
        
        <div className="relative z-10 flex items-center gap-3 font-bold text-2xl">
          <div className="bg-primary-foreground/10 p-2 rounded-xl">
            <Building2 className="h-6 w-6" />
          </div>
          <span>SVR Travels</span>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight">
            Travel Operations Platform
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-10 leading-relaxed">
            Everything your travel company needs in one place. Replace spreadsheets with a unified operational ERP.
          </p>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-primary-foreground/90 uppercase tracking-wider text-sm mb-4">Manage</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 bg-primary-foreground/5 p-3 rounded-lg border border-primary-foreground/10 backdrop-blur-sm">
                  <div className="text-primary-foreground/70">{feature.icon}</div>
                  <span className="font-medium">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="relative z-10 flex items-center gap-4 text-sm text-primary-foreground/60 font-medium">
          <CheckCircle2 className="h-4 w-4" />
          <span>Enterprise-grade security</span>
          <span className="mx-2">•</span>
          <span>&copy; {new Date().getFullYear()} SVR Travels</span>
        </div>
      </div>

      {/* Form Panel */}
      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2 md:p-12">
        <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </div>
    </div>
  );
}
