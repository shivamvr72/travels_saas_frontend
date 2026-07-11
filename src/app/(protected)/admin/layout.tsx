'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Users, Shield, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Can } from '@/shared/permissions/can';
import { PERMISSION_KEYS } from '@/shared/permissions';

const ADMIN_NAVIGATION = [
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
    permission: PERMISSION_KEYS.USERS_VIEW,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    permission: PERMISSION_KEYS.SETTINGS_VIEW,
  },
  {
    name: 'Audit Logs',
    href: '/admin/audit',
    icon: FileText,
    permission: PERMISSION_KEYS.AUDIT_VIEW,
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <Shield className="h-6 w-6 text-indigo-600" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Administration</h1>
          <p className="text-sm text-gray-500">Manage users, security, and system settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        <Card className="col-span-1 p-2">
          <nav className="flex flex-col space-y-1">
            {ADMIN_NAVIGATION.map((item) => (
              <Can key={item.name} permission={item.permission}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    pathname.startsWith(item.href)
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {item.name}
                </Link>
              </Can>
            ))}
          </nav>
        </Card>

        <div className="col-span-1 md:col-span-3">
          {children}
        </div>
      </div>
    </div>
  );
}
