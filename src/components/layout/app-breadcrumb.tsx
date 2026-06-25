'use client';

import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import React from 'react';
import Link from 'next/link';

// Map path segments to human-readable labels
const breadcrumbLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  trips: 'Trips',
  customers: 'Customers',
  routes: 'Routes',
  vehicles: 'Vehicles',
  drivers: 'Drivers',
  expenses: 'Expenses',
  payments: 'Payments',
  'external-hiring': 'External Hiring',
  profitability: 'Profitability',
  settings: 'Settings',
  profile: 'Profile',
};

export function AppBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <Breadcrumb className="hidden sm:block">
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = `/${segments.slice(0, index + 1).join('/')}`;
          
          // Try to get a pre-defined label, otherwise capitalize the segment
          let label = breadcrumbLabels[segment];
          if (!label) {
            // Check if it looks like a UUID or ID (simple heuristic: has hyphen or is long)
            if (segment.includes('-') && segment.length > 20) {
              label = 'Details';
            } else {
              label = segment.charAt(0).toUpperCase() + segment.slice(1);
            }
          }

          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={href}>{label}</Link>} />
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
