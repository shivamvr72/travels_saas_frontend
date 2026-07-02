import { apiClient } from '@/shared/lib/axios';

export type ResourceType = 'vehicle' | 'driver' | 'co_driver';

export type AvailabilityStatus = 'available' | 'busy' | 'unavailable';

export interface ResourceAvailabilityCheck {
  resourceId: string;
  resourceType: ResourceType;
  startDate: string;
  endDate?: string | null;
}

export interface ResourceAvailabilityResult {
  status: AvailabilityStatus;
  message?: string;
  conflictingTripId?: string;
}

class ResourceAvailabilityService {
  async checkAvailability(
    params: ResourceAvailabilityCheck
  ): Promise<ResourceAvailabilityResult> {
    // In a real application, this would call:
    // const res = await apiClient.post('/trips/check-availability', params);
    // return res.data;

    // Mock implementation for frontend development
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simulate 80% chance of available, 10% busy, 10% unavailable
    const rand = Math.random();
    
    if (rand < 0.1) {
      return {
        status: 'unavailable',
        message: 'Resource is undergoing maintenance or is on leave.',
      };
    }
    
    if (rand < 0.2) {
      return {
        status: 'busy',
        message: 'Resource is assigned to another trip during this time.',
        conflictingTripId: 'TRP-DEMO-9999',
      };
    }

    return {
      status: 'available',
    };
  }
}

export const resourceAvailabilityService = new ResourceAvailabilityService();
