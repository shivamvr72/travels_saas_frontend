import { ReactNode } from 'react';
import { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { AppDataTableColumn } from './app-data-table';
import { ActionDef } from './app-toolbar';
import { AppModule } from '@/shared/permissions';
import { 
  ColumnMetadata, 
  CrudFormMetadata, 
  FilterConfig,
  CrudTableMetadata,
  CrudDetailMetadata,
  PageMetadata,
  StatisticMetadata
} from './metadata-types';
import * as z from 'zod';

export interface LifecycleHooks<TCreate = unknown, TUpdate = unknown> {
  beforeCreate?: (data: TCreate) => Promise<TCreate | void> | TCreate | void;
  afterCreate?: (data: TCreate, response: unknown) => Promise<void> | void;
  beforeUpdate?: (id: string, data: TUpdate) => Promise<TUpdate | void> | TUpdate | void;
  afterUpdate?: (id: string, data: TUpdate, response: unknown) => Promise<void> | void;
  beforeDelete?: (id: string) => Promise<boolean | void> | boolean | void;
  afterDelete?: (id: string) => Promise<void> | void;
}

export interface FeatureConfig<TList = unknown, TDetail = unknown, TCreate = unknown, TUpdate = unknown> {
  // General Module Setup
  entityName: string; // e.g., 'Company', 'Driver'
  entityNamePlural: string; // e.g., 'Companies', 'Drivers'
  modulePermissions: AppModule;
  routeBase: string; // e.g., '/companies', '/drivers'
  
  // Advanced Page Metadata
  page?: PageMetadata;
  
  // API Hooks (injected so Crud components are purely UI)
  hooks: {
    useList: (params: Record<string, unknown>) => UseQueryResult<{ data?: TList[]; items?: TList[]; total: number; page: number; size?: number; page_size?: number }, Error>;
    useDetail: (id: string) => UseQueryResult<TDetail, Error>;
    useCreate: () => UseMutationResult<unknown, Error, TCreate, unknown>;
    useUpdate: () => UseMutationResult<unknown, Error, { id: string; data: TUpdate }, unknown>;
    useDelete: () => UseMutationResult<unknown, Error, string, unknown>;
  };
  
  // Lifecycle Hooks
  lifecycle?: LifecycleHooks<TCreate, TUpdate>;
  
  // List View Config
  list: {
    columns?: ColumnMetadata<TList>[] | AppDataTableColumn<TList>[]; // Legacy support
    table?: CrudTableMetadata<TList>; // New declarative table
    searchPlaceholder?: string;
    defaultSortBy?: string;
    defaultSortDir?: 'asc' | 'desc';
    filters?: FilterConfig[];
    filterComponent?: ReactNode; // Legacy ReactNode filter
    rowActions?: (item: TList) => ActionDef[]; // Legacy
    bulkActions?: (selectedIds: Set<string>) => ActionDef[]; // Legacy
  };
  
  // Statistics Config
  statistics?: StatisticMetadata[];

  // Form View Config (Metadata driven)
  form?: CrudFormMetadata;
  schema?: z.ZodTypeAny;
  
  // Detail View Config
  detail?: {
    customLayout?: (data: TDetail) => ReactNode; // Legacy escape hatch
    metadata?: CrudDetailMetadata; // New declarative layout
  };
}

// Alias for backwards compatibility during migration
export type CrudModuleConfig<TList = unknown, TDetail = unknown, TCreate = unknown, TUpdate = unknown> = FeatureConfig<TList, TDetail, TCreate, TUpdate>;
