// removed CrudModuleConfig
import {
  useCustomers,
  useCustomer,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
  Customer,
  CustomerCreate,
  CustomerUpdate,
} from '../api';
import { customerSchema } from '../schemas';
import { featureRegistry } from '@/shared/config/feature-registry';
import { FeatureConfig } from '@/components/layout/crud/crud-types';

export const customerConfig: FeatureConfig<Customer, Customer, CustomerCreate, CustomerUpdate> = {
  entityName: 'Passenger',
  entityNamePlural: 'Passengers',
  modulePermissions: 'CUSTOMERS',
  routeBase: '/customers',
  schema: customerSchema,
  hooks: {
    useList: useCustomers,
    useDetail: useCustomer,
    useCreate: useCreateCustomer,
    useUpdate: useUpdateCustomer,
    useDelete: useDeleteCustomer,
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
          key: 'phone',
          header: 'Phone',
          sortable: true,
          type: 'phone',
        },
        {
          key: 'email',
          header: 'Email',
          sortable: true,
          type: 'email',
        },
        {
          key: 'id_proof_type',
          header: 'ID Type',
        },
        {
          key: 'id_proof_number',
          header: 'ID Number',
        },
        {
          key: 'address',
          header: 'Address',
          sortable: true,
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
          { name: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. John Doe', required: true },
          { name: 'phone', label: 'Phone Number', type: 'text', required: true },
          { name: 'alternate_phone', label: 'Alternate Phone', type: 'text' },
          { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
        ],
      },
      {
        title: 'ID Proof',
        fields: [
          { name: 'id_proof_type', label: 'ID Document Type', type: 'select', options: [
            { value: 'Aadhaar', label: 'Aadhaar Card' },
            { value: 'PAN', label: 'PAN Card' },
            { value: 'Passport', label: 'Passport' },
            { value: 'Driving License', label: 'Driving License' },
            { value: 'Voter ID', label: 'Voter ID' },
          ]},
          { name: 'id_proof_number', label: 'Document Number', type: 'text', placeholder: 'e.g. 1234 5678 9012' },
        ],
      },
      {
        title: 'Address',
        fields: [
          { name: 'address', label: 'Full Address', type: 'textarea', placeholder: 'e.g. 123 Main St, Mumbai, Maharashtra 400001', span: 2, rows: 3 },
        ],
      },
    ],
  },
  detail: {
    metadata: {
      cards: [
        {
          title: 'Passenger Information',
          fields: [
            { name: 'name', label: 'Full Name' },
            { name: 'phone', label: 'Phone', type: 'phone' },
            { name: 'alternate_phone', label: 'Alternate Phone', type: 'phone' },
            { name: 'email', label: 'Email', type: 'email' },
          ],
        },
        {
          title: 'Identity Document',
          fields: [
            { name: 'id_proof_type', label: 'Document Type' },
            { name: 'id_proof_number', label: 'Document Number' },
          ],
        },
        {
          title: 'Address Details',
          fields: [
            { name: 'address', label: 'Registered Address' },
          ],
        },
      ]
    }
  }
};

featureRegistry.register('customers', customerConfig);
