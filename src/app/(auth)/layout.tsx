import { ReactNode } from 'react';
import { Building2 } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Brand Panel (Hidden on mobile) */}
      <div className="hidden w-1/2 flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2 font-bold text-2xl">
          <Building2 className="h-8 w-8" />
          <span>SVR Travels</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4">Travel Operations SaaS</h1>
          <p className="text-lg opacity-90 max-w-md">
            The complete management system for travel operators, fleet managers, and transport businesses.
          </p>
        </div>
        <div className="text-sm opacity-80">
          &copy; {new Date().getFullYear()} SVR Travels. All rights reserved.
        </div>
      </div>

      {/* Form Panel */}
      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2 md:p-10 bg-background">
        <div className="w-full max-w-sm md:max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
