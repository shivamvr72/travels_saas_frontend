import {
  useVehicleExpenses,
  useVehicleExpense,
  useCreateVehicleExpense,
  useUpdateVehicleExpense,
  useDeleteVehicleExpense,
  VehicleExpense,
  VehicleExpenseCreate,
  VehicleExpenseUpdate,
} from '../api';
import { vehicleExpenseSchema, EXPENSE_TYPES, EXPENSE_TYPE_LABELS, PAYMENT_MODES } from '../schemas';
import { featureRegistry } from '@/shared/config/feature-registry';
import { FeatureConfig } from '@/components/layout/crud/crud-types';
import { Badge } from '@/components/ui/badge';
import { VehicleNameCell, TripRefCell, OdometerCell, DescriptionCell } from '../components/expense-list-cells';

// ─── Category Color Map ───────────────────────────────────────────────────────

export const CATEGORY_COLORS: Record<string, string> = {
  fuel:             'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400',
  service:          'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400',
  tyre:             'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400',
  repair:           'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400',
  insurance:        'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
  tax:              'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400',
  permit:           'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400',
  cleaning:         'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400',
  external_hire:    'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400',
  toll:             'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400',
  parking:          'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400',
  driver_allowance: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400',
  food:             'bg-lime-100 text-lime-700 border-lime-200 dark:bg-lime-900/30 dark:text-lime-400',
  accommodation:    'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400',
  police:           'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400',
  other:            'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400',
};

// ─── Feature Config ───────────────────────────────────────────────────────────

export const expensesConfig: FeatureConfig<VehicleExpense, VehicleExpense, VehicleExpenseCreate, VehicleExpenseUpdate> = {
  entityName: 'Expense',
  entityNamePlural: 'Expenses',
  modulePermissions: 'FINANCE',
  routeBase: '/expenses',
  schema: vehicleExpenseSchema,

  page: {
    title: 'Fleet Expenses',
    subtitle: 'Track and manage all vehicle-level operating expenses',
  },

  hooks: {
    useList:   useVehicleExpenses,
    useDetail: useVehicleExpense,
    useCreate: useCreateVehicleExpense,
    useUpdate: useUpdateVehicleExpense,
    useDelete: useDeleteVehicleExpense,
  },

  // ─── List / Table ────────────────────────────────────────────────────────────
  list: {
    defaultSortBy:  'expense_date',
    defaultSortDir: 'desc',
    table: {
      searchPlaceholder: 'Search by vendor, notes…',
      columns: [
        {
          key: 'expense_date',
          header: 'Date',
          type: 'date',
          sortable: true,
          responsive: 'all',
        },
        {
          key: 'expense_type',
          header: 'Category',
          sortable: true,
          responsive: 'all',
          render: (item: VehicleExpense) => (
            <Badge
              variant="outline"
              className={`text-xs font-medium ${CATEGORY_COLORS[item.expense_type] ?? ''}`}
            >
              {EXPENSE_TYPE_LABELS[item.expense_type as keyof typeof EXPENSE_TYPE_LABELS] ?? item.expense_type}
            </Badge>
          ),
        },
        {
          key: 'vehicle_id',
          header: 'Vehicle',
          sortable: false,
          responsive: 'all',
          render: (item: VehicleExpense) => (
            <VehicleNameCell vehicleId={item.vehicle_id} />
          ),
        },
        {
          key: 'vendor_name',
          header: 'Vendor / Paid By',
          sortable: true,
          responsive: 'tablet',
          render: (item: VehicleExpense) => (
            <DescriptionCell vendorName={item.vendor_name} notes={item.notes} />
          ),
        },
        {
          key: 'trip_id',
          header: 'Trip',
          sortable: false,
          responsive: 'tablet',
          render: (item: VehicleExpense) => (
            <TripRefCell tripId={item.trip_id} />
          ),
        },
        {
          key: 'payment_mode',
          header: 'Mode',
          type: 'badge',
          sortable: true,
          responsive: 'desktop',
        },
        {
          key: 'km_at_expense',
          header: 'Odometer',
          sortable: true,
          align: 'right',
          responsive: 'desktop',
          render: (item: VehicleExpense) => (
            <OdometerCell km={item.km_at_expense} />
          ),
        },
        {
          key: 'amount',
          header: 'Amount',
          type: 'currency',
          sortable: true,
          align: 'right',
          responsive: 'all',
          className: 'font-semibold',
        },
      ],
      filters: [
        {
          name: 'expense_type',
          label: 'Category',
          type: 'select',
          placeholder: 'All categories',
          options: EXPENSE_TYPES.map(t => ({
            label: EXPENSE_TYPE_LABELS[t],
            value: t,
          })),
        },
        {
          name: 'payment_mode',
          label: 'Payment Mode',
          type: 'select',
          placeholder: 'All modes',
          options: PAYMENT_MODES.map(m => ({
            label: m.toUpperCase(),
            value: m,
          })),
        },
        {
          name: 'start_date',
          label: 'From Date',
          type: 'date',
        },
        {
          name: 'end_date',
          label: 'To Date',
          type: 'date',
        },
      ],
    },
  },

  // ─── Create / Edit Form ──────────────────────────────────────────────────────
  form: {
    layout: 'groups',
    groups: [
      {
        title: 'Expense Details',
        sections: [
          {
            fields: [
              {
                name: 'expense_date',
                label: 'Date',
                type: 'date',
                required: true,
              },
              {
                name: 'expense_type',
                label: 'Category',
                type: 'select',
                required: true,
                options: EXPENSE_TYPES.map(t => ({
                  label: EXPENSE_TYPE_LABELS[t],
                  value: t,
                })),
              },
              {
                name: 'amount',
                label: 'Amount (₹)',
                type: 'currency',
                required: true,
                min: 0,
                placeholder: 'e.g. 2500.00',
              },
              {
                name: 'payment_mode',
                label: 'Payment Mode',
                type: 'select',
                options: PAYMENT_MODES.map(m => ({
                  label: m.toUpperCase(),
                  value: m,
                })),
              },
              {
                name: 'vendor_name',
                label: 'Vendor / Paid By',
                type: 'text',
                placeholder: 'e.g. HP Petrol Pump, Goodyear Tyres',
              },
              {
                name: 'receipt_url',
                label: 'Receipt URL',
                type: 'text',
                placeholder: 'https://…',
              },
            ],
          },
        ],
      },
      {
        title: 'Vehicle & Odometer',
        sections: [
          {
            fields: [
              {
                name: 'vehicle_id',
                label: 'Vehicle',
                type: 'lookup',
                lookupKey: 'vehicles',
                required: true,
              },
              {
                name: 'km_at_expense',
                label: 'Odometer at Expense (km)',
                type: 'number',
                min: 0,
                placeholder: 'e.g. 45000',
              },
              {
                name: 'next_service_km',
                label: 'Next Service Due (km)',
                type: 'number',
                min: 0,
                placeholder: 'e.g. 55000',
              },
              {
                name: 'notes',
                label: 'Notes / Remarks',
                type: 'textarea',
                span: 2,
                rows: 3,
                placeholder: 'Any additional details…',
              },
            ],
          },
        ],
      },
    ],
  },

  // ─── Detail View ─────────────────────────────────────────────────────────────
  detail: {
    metadata: {
      cards: [
        {
          title: 'Expense Information',
          fields: [
            { name: 'expense_date',   label: 'Date',         type: 'date' },
            {
              name: 'expense_type',
              label: 'Category',
              renderDetail: (data: Record<string, any>) => (
                <Badge
                  variant="outline"
                  className={`text-xs font-medium ${CATEGORY_COLORS[data.expense_type] ?? ''}`}
                >
                  {EXPENSE_TYPE_LABELS[data.expense_type as keyof typeof EXPENSE_TYPE_LABELS] ?? data.expense_type}
                </Badge>
              ),
            },
            { name: 'amount',         label: 'Amount',       type: 'currency' },
            { name: 'payment_mode',   label: 'Payment Mode' },
            { name: 'vendor_name',    label: 'Vendor / Paid By' },
          ],
        },
        {
          title: 'Vehicle & Odometer',
          fields: [
            { name: 'vehicle_id',      label: 'Vehicle',               type: 'lookup', lookupKey: 'vehicles' },
            { name: 'km_at_expense',   label: 'Odometer at Expense',   type: 'distance' },
            { name: 'next_service_km', label: 'Next Service Due',      type: 'distance' },
          ],
        },
        {
          title: 'Additional Information',
          fields: [
            { name: 'receipt_url', label: 'Receipt URL' },
            { name: 'notes',       label: 'Notes' },
            { name: 'created_at',  label: 'Recorded On', type: 'datetime' },
          ],
        },
      ],
      showAuditInfo: true,
    },
  },
};

featureRegistry.register('expenses', expensesConfig);
