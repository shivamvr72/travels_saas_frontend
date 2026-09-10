import { z } from 'zod';

export const externalHiringSchema = z.object({
  provider_type: z.enum(['registered_travel', 'individual_owner', 'rental_agency']).default('rental_agency'),
  provider_name: z.string().optional(),
  provider_phone: z.string().optional(),
  provider_travel_id: z.string().uuid().optional(),
  
  external_vehicle_reg: z.string().optional(),
  vehicle_description: z.string().optional(),
  vehicle_id: z.string().uuid().optional(),
  
  with_driver: z.boolean().default(false),
  external_driver_name: z.string().optional(),
  driver_id: z.string().uuid().optional(),

  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional(),
  agreed_rate: z.number().min(0, 'Agreed rate must be positive'),
  rate_type: z.enum(['per_day', 'per_km', 'per_trip', 'fixed']).default('fixed'),
  total_amount_payable: z.number().min(0).optional(),
  amount_paid: z.number().min(0).optional(),
  status: z.enum(['active', 'completed', 'settled', 'cancelled']).default('active'),
}).superRefine((data, ctx) => {
  if (data.provider_type === 'registered_travel' && !data.provider_travel_id) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Select an internal provider', path: ['provider_travel_id'] });
  }
  if (data.provider_type !== 'registered_travel' && !data.provider_name) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Provider name is required', path: ['provider_name'] });
  }
  if (!data.vehicle_id && !data.external_vehicle_reg) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Either Vehicle Registration or Internal Vehicle is required', path: ['external_vehicle_reg'] });
  }
});
