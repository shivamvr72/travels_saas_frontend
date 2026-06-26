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
      { title: 'Customers', href: '/customers', icon: Users, module: 'COMPANIES' },
      { title: 'Routes', href: '/routes', icon: MapPin, module: 'COMPANIES' },
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
      { title: 'Payments', href: '/payments', icon: Banknote, module: 'FINANCE' },
      { title: 'External Hiring', href: '/external-hiring', icon: Bus, module: 'FINANCE' },
      { title: 'Profitability', href: '/profitability', icon: PieChart, module: 'FINANCE' },
    ],
  },
  {
    group: 'Administration',
    items: [
      { title: 'Company Settings', href: '/settings', icon: Building2, module: 'SETTINGS' },
      { title: 'Profile', href: '/profile', icon: Settings }, // Profile is typically accessible to all
    ],
  },
];
