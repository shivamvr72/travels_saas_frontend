// removed CrudModuleConfig
import {
  useDrivers,
  useDriver,
  useCreateDriver,
  useUpdateDriver,
  useDeleteDriver,
  Driver,
  DriverCreate,
  DriverUpdate,
} from '../api';
import { driverSchema } from '../schemas';
import { featureRegistry } from '@/shared/config/feature-registry';
import { FeatureConfig } from '@/components/layout/crud/crud-types';
import { getLicenseStatus } from '@/shared/utils';
import { AppStatusBadge } from '@/components/shared/app-status-badge';

export const driverConfig: FeatureConfig<Driver, Driver, DriverCreate, DriverUpdate> = {
  entityName: 'Driver',
  entityNamePlural: 'Drivers',
  modulePermissions: 'DRIVERS',
  routeBase: '/drivers',
  schema: driverSchema,
  hooks: {
    useList: useDrivers,
    useDetail: useDriver,
    useCreate: useCreateDriver,
    useUpdate: useUpdateDriver,
    useDelete: useDeleteDriver,
  },
  list: {
    defaultSortBy: 'first_name',
    defaultSortDir: 'asc',
    table: {
      columns: [
        {
          key: 'name',
          header: 'Name',
          sortable: true,
          className: 'font-medium',
        },
        {
          key: 'phone',
          header: 'Phone',
          sortable: true,
          type: 'phone',
        },
        {
          key: 'license_no',
          header: 'License No',
          sortable: true,
        },
        {
          key: 'license_expiry',
          header: 'License Status',
          sortable: true,
          render: (item) => {
            const status = getLicenseStatus(item.license_expiry);
            return <AppStatusBadge status={status} domain="document" />;
          },
        },
        {
          key: 'is_active',
          header: 'Status',
          sortable: true,
          type: 'status',
        },
      ]
    }
  },
  form: {
    layout: 'default',
    sections: [
      {
        title: 'Personal Information',
        fields: [
          { name: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. Firstname Middle Lastname', required: true },
          { name: 'phone', label: 'Primary Phone', type: 'text', placeholder: 'e.g. 9876543210', required: true },
          { name: 'alternate_phone', label: 'Alternate Phone', type: 'text', placeholder: 'e.g. 9876543210' },
          { name: 'date_of_birth', label: 'Date of Birth', type: 'date' },
          { name: 'address', label: 'Address', type: 'textarea', placeholder: 'e.g. 123 Main St...' },
          { name: 'joining_date', label: 'Joining Date', type: 'date' },
          { name: 'monthly_salary', label: 'Monthly Salary', type: 'number', placeholder: 'e.g. 25000', min: 0 },
        ],
      },
      {
        title: 'License & Documentation',
        fields: [
          { name: 'license_no', label: 'License Number', type: 'text', placeholder: 'e.g. MH1420110012345', required: true },
          { name: 'license_expiry', label: 'License Expiry Date', type: 'date', required: true },
        ],
      },
      {
        title: 'Additional Information',
        fields: [
          { name: 'address', label: 'Full Address', type: 'textarea', placeholder: '123 Main St...', span: 2, rows: 2 },
          { name: 'notes', label: 'Notes (Internal)', type: 'textarea', placeholder: 'Special remarks', span: 2, rows: 3 },
          { name: 'is_active', label: 'Active Status', type: 'switch', description: 'Inactive drivers cannot be assigned to trips.' },
        ],
      },
    ],
  },
  detail: {
    metadata: {
      cards: [
        {
          title: 'Personal Information',
          fields: [
            { name: 'name', label: 'Name' },
            { name: 'phone', label: 'Primary Phone', type: 'phone' },
            { name: 'alternate_phone', label: 'Alternate Phone', type: 'phone' },
            { name: 'date_of_birth', label: 'Date of Birth', type: 'date' },
            { name: 'address', label: 'Address' },
          ],
        },
        {
          title: 'Employment Details',
          fields: [
            { name: 'joining_date', label: 'Joining Date', type: 'date' },
            { name: 'monthly_salary', label: 'Monthly Salary', type: 'currency' },
            { name: 'is_active', label: 'Status', type: 'status' },
          ],
        },
        {
          title: 'License & Documentation',
          fields: [
            { name: 'license_no', label: 'License Number' },
            { name: 'license_expiry', label: 'License Expiry Date', type: 'date' },
          ],
        },
      ]
    }
  }
};

featureRegistry.register('drivers', driverConfig);
