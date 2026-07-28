import {
  LayoutDashboard,
  Building2,
  Users,
  Car,
  MapPin,
  Briefcase,
  Wallet,
  Settings,
  Wrench,
  PieChart,
  UserCircle,
  Bus,
  Banknote,
  BarChart2,
  TrendingUp,
  Receipt,
  FileText,
  ShieldAlert,
  ClipboardList
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
      { title: 'Dispatch Board', href: '/dispatch', icon: ClipboardList, module: 'DISPATCH' },
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
      { title: 'Maintenance', href: '/fleet/maintenance', icon: Wrench, module: 'VEHICLES' },
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
    group: 'Reports & Analytics',
    items: [
      { title: 'Executive Dashboard', href: '/reports', icon: BarChart2, module: 'REPORTS' },
      { title: 'Revenue Analytics', href: '/reports/revenue', icon: TrendingUp, module: 'REPORTS' },
      { title: 'Expense Analytics', href: '/reports/expenses', icon: Receipt, module: 'REPORTS' },
      { title: 'Profitability', href: '/reports/profitability', icon: PieChart, module: 'REPORTS' },
      { title: 'Fleet Analytics', href: '/reports/fleet', icon: Car, module: 'REPORTS' },
      { title: 'Driver Analytics', href: '/reports/drivers', icon: UserCircle, module: 'REPORTS' },
      { title: 'Financial Registers', href: '/reports/registers', icon: FileText, module: 'REPORTS' },
    ],
  },
  {
    group: 'Administration',
    items: [
      { title: 'Administration', href: '/admin', icon: ShieldAlert, module: 'USERS' },
    ],
  },
];
