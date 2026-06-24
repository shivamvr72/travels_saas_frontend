import {
  LayoutDashboard,
  Building2,
  Users,
  Car,
  MapPin,
  Briefcase,
  Wallet,
  Settings,
  PieChart
} from 'lucide-react';
import { AppModule } from '../permissions';

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  module?: AppModule;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export const NAVIGATION_CONFIG: NavGroup[] = [
  {
    group: 'Overview',
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    group: 'Operations',
    items: [
      { title: 'Trips', href: '/trips', icon: Briefcase, module: 'TRIPS' },
    ],
  },
  {
    group: 'Master Data',
    items: [
      { title: 'Companies', href: '/companies', icon: Building2, module: 'COMPANIES' },
      { title: 'Customers', href: '/customers', icon: Users, module: 'COMPANIES' },
      { title: 'Drivers', href: '/drivers', icon: Users, module: 'DRIVERS' },
      { title: 'Vehicles', href: '/vehicles', icon: Car, module: 'VEHICLES' },
      { title: 'Routes', href: '/routes', icon: MapPin, module: 'COMPANIES' }, // Fallback to COMPANIES permission
    ],
  },
  {
    group: 'Finance',
    items: [
      { title: 'Expenses', href: '/expenses', icon: Wallet, module: 'FINANCE' },
      { title: 'Payments', href: '/payments', icon: Wallet, module: 'FINANCE' },
      { title: 'Profitability', href: '/profitability', icon: PieChart, module: 'FINANCE' },
    ],
  },
  {
    group: 'System',
    items: [
      { title: 'Settings', href: '/settings', icon: Settings, module: 'SETTINGS' },
    ],
  },
];
