// removed CrudModuleConfig
import {
  useVehicles,
  useVehicle,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
  Vehicle,
  VehicleCreate,
  VehicleUpdate,
} from '../api';
import { vehicleSchema } from '../schemas';
import { featureRegistry } from '@/shared/config/feature-registry';
import { FeatureConfig } from '@/components/layout/crud/crud-types';

export const vehicleConfig: FeatureConfig<Vehicle, Vehicle, VehicleCreate, VehicleUpdate> = {
  entityName: 'Vehicle',
  entityNamePlural: 'Vehicles',
  modulePermissions: 'VEHICLES',
  routeBase: '/vehicles',
  schema: vehicleSchema,
  hooks: {
    useList: useVehicles,
    useDetail: useVehicle,
    useCreate: useCreateVehicle,
    useUpdate: useUpdateVehicle,
    useDelete: useDeleteVehicle,
  },
  list: {
    defaultSortBy: 'reg_number',
    defaultSortDir: 'asc',
    table: {
      columns: [
        {
          key: 'reg_number',
          header: 'Reg No',
          sortable: true,
          className: 'font-medium',
        },
        {
          key: 'brand_name',
          header: 'Brand',
          sortable: true,
        },
        {
          key: 'model_type',
          header: 'Model',
          sortable: true,
        },
        {
          key: 'seating_capacity',
          header: 'Capacity',
          sortable: true,
          type: 'capacity',
        },
        {
          key: 'fuel_type',
          header: 'Fuel Type',
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
        title: 'Vehicle Details',
        fields: [
          { name: 'reg_number', label: 'Registration Number', type: 'text', placeholder: 'MH-01-AB-1234', required: true },
          { name: 'brand_name', label: 'Make / Brand', type: 'text', placeholder: 'Toyota', required: true },
          { name: 'model_type', label: 'Model', type: 'text', placeholder: 'Innova', required: true },
          { name: 'vehicle_type', label: 'Vehicle Type', type: 'select', options: [
            { value: 'Hatchback', label: 'Hatchback' }, { value: 'Sedan', label: 'Sedan' },
            { value: 'SUV', label: 'SUV' }, { value: 'MUV', label: 'MUV' },
            { value: 'Minibus', label: 'Minibus' }, { value: 'Bus', label: 'Bus' }, { value: 'Luxury', label: 'Luxury' }
          ]},
          { name: 'seating_capacity', label: 'Seating Capacity', type: 'number', min: 1 },
          { name: 'fuel_type', label: 'Fuel Type', type: 'select', options: [
            { value: 'Petrol', label: 'Petrol' }, { value: 'Diesel', label: 'Diesel' },
            { value: 'CNG', label: 'CNG' }, { value: 'Electric', label: 'Electric' }, { value: 'Hybrid', label: 'Hybrid' }
          ]},
        ],
      },
      {
        title: 'Compliance & Documents',
        fields: [
          { name: 'rc_expiry', label: 'RC Expiry Date', type: 'date' },
          { name: 'insurance_expiry', label: 'Insurance Expiry Date', type: 'date' },
          { name: 'fitness_expiry', label: 'Fitness Expiry Date', type: 'date' },
          { name: 'permit_expiry', label: 'Permit Expiry Date', type: 'date' },
        ],
      },
      {
        title: 'Status & Availability',
        fields: [
          { name: 'is_active', label: 'Active Status', type: 'switch', description: 'Toggle whether this vehicle is actively part of the fleet.' },
        ],
      },
    ],
  },
  detail: {
    metadata: {
      cards: [
        {
          title: 'Vehicle Information',
          fields: [
            { name: 'reg_number', label: 'Registration Number' },
            { name: 'brand_name', label: 'Brand' },
            { name: 'model_type', label: 'Model' },
            { name: 'vehicle_type', label: 'Vehicle Type' },
            { name: 'fuel_type', label: 'Fuel Type' },
            { name: 'seating_capacity', label: 'Capacity' },
            { name: 'is_active', label: 'Status', type: 'status' },
          ],
        },
        {
          title: 'Compliance Documents (Expiry)',
          fields: [
            { name: 'rc_expiry', label: 'RC Expiry', type: 'date' },
            { name: 'insurance_expiry', label: 'Insurance Expiry', type: 'date' },
            { name: 'fitness_expiry', label: 'Fitness Expiry', type: 'date' },
            { name: 'permit_expiry', label: 'Permit Expiry', type: 'date' },
          ],
        },
      ]
    }
  }
};

featureRegistry.register('vehicles', vehicleConfig);
