import {
  useExternalHirings,
  useExternalHiring,
  useCreateExternalHiring,
  useUpdateExternalHiring,
  useDeleteExternalHiring,
  ExternalHiring,
  ExternalHiringCreate,
  ExternalHiringUpdate,
} from '../api';
import { externalHiringSchema } from '../schemas';
import { featureRegistry } from '@/shared/config/feature-registry';
import { FeatureConfig } from '@/components/layout/crud/crud-types';

export const externalHiringConfig: FeatureConfig<ExternalHiring, ExternalHiring, ExternalHiringCreate, ExternalHiringUpdate> = {
  entityName: 'External Hiring',
  entityNamePlural: 'External Hirings',
  modulePermissions: 'FINANCE',
  routeBase: '/external-hiring',
  schema: externalHiringSchema,
  hooks: {
    useList: useExternalHirings,
    useDetail: useExternalHiring,
    useCreate: useCreateExternalHiring,
    useUpdate: useUpdateExternalHiring,
    useDelete: useDeleteExternalHiring,
  },
  list: {
    defaultSortBy: 'created_at',
    defaultSortDir: 'desc',
    table: {
      searchPlaceholder: 'Search by provider, vehicle reg, or status...',
      columns: [
        {
          key: 'provider_name',
          header: 'Provider',
          sortable: true,
          className: 'font-medium',
        },
        {
          key: 'external_vehicle_reg',
          header: 'Vehicle Reg',
          sortable: true,
        },
        {
          key: 'start_date',
          header: 'Start Date',
          sortable: true,
          type: 'date',
        },
        {
          key: 'rate_type',
          header: 'Rate Type',
          sortable: false,
          type: 'badge',
        },
        {
          key: 'total_amount_payable',
          header: 'Total Cost',
          sortable: true,
          type: 'currency',
        },
        {
          key: 'balance_due',
          header: 'Balance Due',
          sortable: true,
          type: 'currency',
        },
        {
          key: 'status',
          header: 'Status',
          sortable: true,
          type: 'status',
        },
      ],
      filters: [
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'completed', label: 'Completed' },
            { value: 'settled', label: 'Settled' },
            { value: 'cancelled', label: 'Cancelled' },
          ],
        },
      ],
    },
  },
  form: {
    layout: 'default',
    sections: [
      {
        title: 'Hiring Details',
        fields: [
          { name: 'provider_type', label: 'Provider Type', type: 'select', options: [
            { value: 'rental_agency', label: 'Rental Agency' },
            { value: 'registered_travel', label: 'Registered Travel Agency' },
            { value: 'individual_owner', label: 'Individual Owner' },
          ]},
          { 
            name: 'provider_name', 
            label: 'Provider Name', 
            type: 'text', 
            visibleWhen: (data) => data.provider_type !== 'registered_travel',
            requiredWhen: (data) => data.provider_type !== 'registered_travel',
          },
          { 
            name: 'provider_phone', 
            label: 'Provider Phone', 
            type: 'text',
            visibleWhen: (data) => data.provider_type !== 'registered_travel',
          },
          {
            name: 'provider_travel_id',
            label: 'Registered Travel Agency',
            type: 'lookup',
            lookupKey: 'companies',
            visibleWhen: (data) => data.provider_type === 'registered_travel',
            requiredWhen: (data) => data.provider_type === 'registered_travel',
          },
          {
            name: 'vehicle_id',
            label: 'Internal Vehicle (Select if in fleet)',
            type: 'lookup',
            lookupKey: 'vehicles',
            visibleWhen: (data) => !data.external_vehicle_reg,
          },
          { 
            name: 'external_vehicle_reg', 
            label: 'External Vehicle Registration', 
            type: 'text',
            visibleWhen: (data) => !data.vehicle_id,
          },
          { 
            name: 'vehicle_description', 
            label: 'Vehicle Name / Model', 
            type: 'text',
            placeholder: 'e.g. Innova Crysta, Bus 40 Seater',
            visibleWhen: (data) => !data.vehicle_id,
          },
          {
            name: 'with_driver',
            label: 'Include Driver?',
            type: 'switch'
          },
          {
            name: 'driver_id',
            label: 'Internal Driver (Select if in fleet)',
            type: 'lookup',
            lookupKey: 'drivers',
            visibleWhen: (data) => !!data.with_driver && !data.external_driver_name,
          },
          {
            name: 'external_driver_name',
            label: 'External Driver Name',
            type: 'text',
            visibleWhen: (data) => !!data.with_driver && !data.driver_id,
          },
          { name: 'start_date', label: 'Start Date', type: 'date', required: true },
          { name: 'end_date', label: 'End Date', type: 'date' },
        ],
      },
      {
        title: 'Financials',
        fields: [
          { name: 'agreed_rate', label: 'Agreed Rate', type: 'number', required: true },
          { name: 'rate_type', label: 'Rate Type', type: 'select', options: [
            { value: 'fixed', label: 'Fixed / Flat' },
            { value: 'per_day', label: 'Per Day' },
            { value: 'per_km', label: 'Per KM' },
            { value: 'per_trip', label: 'Per Trip' },
          ]},
          { name: 'total_amount_payable', label: 'Total Payable', type: 'number' },
          { name: 'amount_paid', label: 'Amount Paid', type: 'number' },
        ],
      },
      {
        title: 'Status',
        fields: [
          { name: 'status', label: 'Status', type: 'select', options: [
            { value: 'active', label: 'Active' },
            { value: 'completed', label: 'Completed' },
            { value: 'settled', label: 'Settled' },
            { value: 'cancelled', label: 'Cancelled' },
          ]},
        ],
      },
    ],
  },
  detail: {
    // documents: {
    //   enabled: true,
    //   entityType: 'EXTERNAL_HIRING',
    //   categories: [
    //     { value: 'VENDOR_INVOICE', label: 'Vendor Invoice' },
    //     { value: 'CONTRACT', label: 'Contract' },
    //     { value: 'OTHER', label: 'Other' },
    //   ],
    //   defaultCategory: 'VENDOR_INVOICE'
    // },
    metadata: {
      cards: [
        {
          title: 'Provider Information',
          fields: [
            { name: 'provider_type', label: 'Provider Type' },
            { name: 'provider_name', label: 'Provider Name' },
            { name: 'provider_phone', label: 'Provider Phone' },
            { name: 'start_date', label: 'Start Date', type: 'date' },
            { name: 'end_date', label: 'End Date', type: 'date' },
            { name: 'status', label: 'Status', type: 'status' },
          ],
        },
        {
          title: 'Vehicle & Driver',
          fields: [
            { name: 'external_vehicle_reg', label: 'Vehicle Registration' },
            { name: 'vehicle_description', label: 'Vehicle Description' },
            { name: 'with_driver', label: 'Includes Driver', type: 'switch' },
            { name: 'external_driver_name', label: 'Driver Name' },
          ],
        },
        {
          title: 'Financial Summary',
          fields: [
            { name: 'rate_type', label: 'Rate Type' },
            { name: 'agreed_rate', label: 'Agreed Rate', type: 'currency' },
            { name: 'total_amount_payable', label: 'Total Payable', type: 'currency' },
            { name: 'amount_paid', label: 'Amount Paid', type: 'currency' },
            { name: 'balance_due', label: 'Balance Due', type: 'currency' },
          ],
        },
      ],
      showAuditInfo: true,
    }
  }
};

featureRegistry.register('external-hiring', externalHiringConfig);
