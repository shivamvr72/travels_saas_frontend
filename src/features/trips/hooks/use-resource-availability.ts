import { useQuery } from '@tanstack/react-query';
import { 
  ResourceAvailabilityCheck, 
  resourceAvailabilityService 
} from '../services/resource-availability.service';

export function useResourceAvailability(params: ResourceAvailabilityCheck, enabled = true) {
  return useQuery({
    queryKey: ['trips', 'availability', params.resourceId, params.resourceType, params.startDate, params.endDate],
    queryFn: () => resourceAvailabilityService.checkAvailability(params),
    enabled: enabled && !!params.resourceId && !!params.startDate,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
