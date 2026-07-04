import { ReactNode } from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { AppModule } from '@/shared/permissions';

export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'currency' 
  | 'percentage'
  | 'email' 
  | 'phone' 
  | 'password' 
  | 'select' 
  | 'date' 
  | 'datetime' 
  | 'checkbox' 
  | 'switch' 
  | 'radio' 
  | 'image' 
  | 'file'
  | 'lookup'
  | 'custom'
  | 'status'
  | 'badge'
  | 'distance'
  | 'duration';

export interface FieldOption {
  label: string;
  value: string | number;
}

export interface FieldPermissions {
  visibleFor?: AppModule[];
  editableFor?: AppModule[];
  visibleIf?: (item: Record<string, unknown>) => boolean;
  editableIf?: (item: Record<string, unknown>) => boolean;
}

export type DynamicFieldCondition = (formValues: Record<string, unknown>) => boolean;

export interface FormFieldConfig {
  name: string;
  label: string;
  type?: FieldType;
  
  placeholder?: string;
  dynamicPlaceholder?: (formValues: Record<string, unknown>) => string;
  description?: string;
  required?: boolean;
  
  // Layout
  span?: 1 | 2; // 1 or 2 (for full width in a 2-col grid)
  
  // Specific to options
  options?: FieldOption[];
  
  // Specific to numbers/currency
  min?: number;
  max?: number;
  step?: number | 'any';
  
  // Specific to textarea
  rows?: number;

  // Specific to image/file
  maxSize?: number; // bytes
  
  // State & Dynamics
  disabled?: boolean;
  hidden?: boolean;
  visibleWhen?: DynamicFieldCondition;
  enabledWhen?: DynamicFieldCondition;
  requiredWhen?: DynamicFieldCondition;
  readonlyWhen?: DynamicFieldCondition;
  
  // Advanced
  permissions?: FieldPermissions;
  
  // Specific to lookup
  lookupKey?: string; // Links to LookupRegistry
  multiple?: boolean;
  
  // For 'custom' type
  render?: (form: UseFormReturn<FieldValues>) => ReactNode;
  renderDetail?: (data: Record<string, any>) => ReactNode;
}

export interface FormSectionConfig {
  title?: string;
  description?: string;
  fields: FormFieldConfig[];
}

export interface FormGroupConfig {
  title: string;
  sections: FormSectionConfig[];
}

export interface FormTabConfig {
  title: string;
  groups: FormGroupConfig[];
}

export interface CrudFormMetadata {
  layout: 'default' | 'tabs' | 'stepper' | 'groups';
  sections?: FormSectionConfig[]; // legacy/simple layout
  groups?: FormGroupConfig[]; // grouped layout
  tabs?: FormTabConfig[]; // tabbed layout
}

export interface DetailCardConfig {
  title: string;
  fields: FormFieldConfig[]; // Reuse fields for detail, ignoring edit-specific stuff
}

export interface CrudDetailMetadata {
  cards: DetailCardConfig[];
  showAuditInfo?: boolean;
}

export interface ColumnMetadata<T = unknown> {
  key: string;
  header: string;
  type?: 'text' | 'currency' | 'date' | 'datetime' | 'status' | 'badge' | 'avatar' | 'phone' | 'email' | 'distance' | 'capacity' | 'duration' | 'percentage' | 'lookup' | 'custom';
  sortable?: boolean;
  searchable?: boolean;
  hideable?: boolean;
  resizable?: boolean;
  className?: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  responsive?: 'desktop' | 'tablet' | 'mobile' | 'all';
  permissions?: FieldPermissions;
  lookupKey?: string; // For resolving IDs to names via LookupRegistry
  // If custom, provide a render function
  render?: (item: T) => ReactNode;
}

export interface BulkActionMetadata<T = unknown> {
  key: string;
  label: string;
  icon?: ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  permission?: AppModule;
  requireConfirm?: boolean;
  confirmTitle?: string;
  confirmMessage?: string;
  action: (selectedIds: Set<string>, items: T[]) => Promise<void>;
}

export interface CrudTableMetadata<T = unknown> {
  columns: ColumnMetadata<T>[];
  defaultSortBy?: string;
  defaultSortDir?: 'asc' | 'desc';
  filters?: FilterConfig[];
  bulkActions?: BulkActionMetadata<T>[];
  searchPlaceholder?: string;
}

export interface PageMetadata {
  title?: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export interface StatisticMetadata {
  key: string;
  title: string;
  valueField: string;
  type?: 'number' | 'currency' | 'percentage';
  trendField?: string;
  trendUpIsGood?: boolean;
  icon?: ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'destructive';
}

export interface FilterConfig {
  name: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'date-range' | 'boolean';
  options?: FieldOption[];
  placeholder?: string;
}
