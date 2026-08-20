import { z } from 'zod';

export const externalHiringSchema = z.object({
  provider_name: z.string().min(1, 'Provider name is required'),
  provider_phone: z.string().optional(),
  provider_type: z.string().default('vendor'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional(),
  agreed_rate: z.number().min(0, 'Agreed rate must be positive'),
  rate_type: z.string().default('flat'),
  total_amount_payable: z.number().min(0).optional(),
  amount_paid: z.number().min(0).optional(),
  status: z.string().default('active'),
  external_vehicle_reg: z.string().optional(),
  vehicle_id: z.string().uuid().optional(),
});
