import {
  LayoutDashboard,
  Building2,
  Users,
  Car,
  MapPin,
  Briefcase,
  Wallet,
  Settings,
  PieChart,
  UserCircle,
  Bus,
  Banknote
} from 'lucide-react';
import { AppModule } from '../permissions';

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  module?: AppModule;
  badge?: number;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
  module?: AppModule; // if the whole group is permissioned
}

export const NAVIGATION_CONFIG: NavGroup[] = [
  {
    group: 'Dashboard',
    items: [
      { title: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    group: 'Operations',
    items: [
      { title: 'Trips', href: '/trips', icon: Briefcase, module: 'TRIPS' },
      { title: 'Companies', href: '/companies', icon: Building2, module: 'COMPANIES' },
      { title: 'Customers', href: '/customers', icon: Users, module: 'CUSTOMERS' },
      { title: 'Routes', href: '/routes', icon: MapPin, module: 'ROUTES' },
    ],
  },
  {
    group: 'Fleet',
    items: [
      { title: 'Vehicles', href: '/vehicles', icon: Car, module: 'VEHICLES' },
      { title: 'Drivers', href: '/drivers', icon: UserCircle, module: 'DRIVERS' },
      { title: 'Expenses', href: '/expenses', icon: Wallet, module: 'FINANCE' },
    ],
  },
  {
    group: 'Finance',
    items: [
      { title: 'Dashboard', href: '/finance/dashboard', icon: PieChart, module: 'FINANCE' },
      { title: 'Receivables', href: '/finance/receivables', icon: Banknote, module: 'FINANCE' },
    ],
  },
  {
    group: 'Administration',
    items: [
      { title: 'Company Settings', href: '/settings', icon: Settings, module: 'SETTINGS' },
    ],
  },
];
