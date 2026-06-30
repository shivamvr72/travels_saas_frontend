// removed CrudModuleConfig
import {
  useCompanies,
  useCompany,
  useCreateCompany,
  useUpdateCompany,
  useDeleteCompany,
  Company,
  CompanyCreate,
  CompanyUpdate,
} from '../api';
import { companySchema } from '../schemas';
import { featureRegistry } from '@/shared/config/feature-registry';
import { FeatureConfig } from '@/components/layout/crud/crud-types';
// removed format phone email

export const companyConfig: FeatureConfig<Company, Company, CompanyCreate, CompanyUpdate> = {
  entityName: 'Company',
  entityNamePlural: 'Companies',
  modulePermissions: 'COMPANIES',
  routeBase: '/companies',
  schema: companySchema,
  hooks: {
    useList: useCompanies,
    useDetail: useCompany,
    useCreate: useCreateCompany,
    useUpdate: useUpdateCompany,
    useDelete: useDeleteCompany,
  },
  list: {
    defaultSortBy: 'name',
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
          key: 'contact_person',
          header: 'Contact Person',
          sortable: true,
        },
        {
          key: 'phone',
          header: 'Phone',
          type: 'phone',
        },
        {
          key: 'email',
          header: 'Email',
          type: 'email',
        },
        {
          key: 'city',
          header: 'City',
          sortable: true,
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
        title: 'Basic Information',
        fields: [
          { name: 'name', label: 'Company Name', type: 'text', placeholder: 'e.g. Acme Corp', required: true },
          { name: 'gstin', label: 'GSTIN', type: 'text', placeholder: 'e.g. 22AAAAA0000A1Z5' },
        ],
      },
      {
        title: 'Primary Contact',
        fields: [
          { name: 'contact_person', label: 'Contact Person Name', type: 'text', placeholder: 'Jane Doe', required: true },
          { name: 'phone', label: 'Contact Phone', type: 'text', placeholder: 'e.g. +91 9876543210', required: true },
          { name: 'email', label: 'Contact Email', type: 'email', placeholder: 'jane@example.com' },
        ],
      },
      {
        title: 'Address',
        fields: [
          { name: 'address', label: 'Street Address', type: 'textarea', placeholder: '123 Business Rd', span: 2, rows: 2 },
          { name: 'city', label: 'City', type: 'text', placeholder: 'e.g. Mumbai' },
          { name: 'state', label: 'State', type: 'text', placeholder: 'e.g. Maharashtra' },
          { name: 'pincode', label: 'Pincode', type: 'text', placeholder: 'e.g. 400001' },
        ],
      },
      {
        title: 'Settings',
        fields: [
          { name: 'credit_period_days', label: 'Credit Period (Days)', type: 'number', placeholder: '0', min: 0 },
          { name: 'is_active', label: 'Active Status', type: 'switch', description: 'Inactive companies cannot be assigned to new trips.' },
        ],
      },
    ],
  },
  detail: {
    metadata: {
      cards: [
        {
          title: 'Company Information',
          fields: [
            { name: 'name', label: 'Company Name' },
            { name: 'gstin', label: 'GSTIN' },
            { name: 'is_active', label: 'Status', type: 'status' },
          ],
        },
        {
          title: 'Location Details',
          fields: [
            { name: 'address', label: 'Registered Address' },
            { name: 'city', label: 'City' },
            { name: 'state', label: 'State' },
            { name: 'pincode', label: 'Pincode' },
          ],
        },
        {
          title: 'Contact Information',
          fields: [
            { name: 'contact_person', label: 'Contact Person' },
            { name: 'phone', label: 'Phone', type: 'phone' },
            { name: 'email', label: 'Email', type: 'email' },
          ],
        },
        {
          title: 'Financial & Settings',
          fields: [
            { name: 'credit_period_days', label: 'Credit Period (Days)' },
          ],
        },
      ]
    }
  }
};

featureRegistry.register('companies', companyConfig);
