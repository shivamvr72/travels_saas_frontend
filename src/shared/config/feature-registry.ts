import { FeatureConfig } from '@/components/layout/crud/crud-types';

export type FeatureKey = 'companies' | 'customers' | 'drivers' | 'vehicles' | 'routes' | string; // Allow string for future modules

class FeatureRegistry {
  private features = new Map<FeatureKey, FeatureConfig<unknown, unknown, unknown, unknown>>();

  register<TList, TDetail, TCreate, TUpdate>(
    key: FeatureKey, 
    config: FeatureConfig<TList, TDetail, TCreate, TUpdate>
  ) {
    this.features.set(key, config as unknown as FeatureConfig<unknown, unknown, unknown, unknown>);
  }

  get(key: FeatureKey): FeatureConfig<unknown, unknown, unknown, unknown> {
    const config = this.features.get(key);
    if (!config) {
      throw new Error(`Feature ${key} not found in registry`);
    }
    return config;
  }
}

export const featureRegistry = new FeatureRegistry();
