import * as z from 'zod';

export const driverSchema = z.object({
  name: z.string().trim().min(2, 'Full name is required').max(100).regex(/^[a-zA-Z\s]+$/, 'Please use valid characters for name (Firstname Middle Lastname)'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number cannot exceed 15 digits').regex(/^\+?[0-9]{10,15}$/, 'Invalid phone format'),
  alternate_phone: z.string().max(15, 'Phone number cannot exceed 15 digits').regex(/^\+?[0-9]{10,15}$/, 'Invalid phone format').nullable().optional().or(z.literal('')),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  address: z.string().trim().max(500, 'Address cannot exceed 500 characters').nullable().optional(),
  joining_date: z.string().min(1, 'Joining date is required'),
  monthly_salary: z.preprocess(
    (val) => (val === '' || val == null ? null : Number(val)), 
    z.number()
      .min(0, 'Salary cannot be negative')
      .max(1000000, 'Salary exceeds allowed maximum')
      .nullable().optional()
  ),
  license_no: z.string().trim().toUpperCase()
    .min(5, 'License number is too short')
    .max(50, 'License number cannot exceed 50 characters')
    .regex(/^[A-Z]{2}[0-9]{2}[ -]?[0-9]{11}$/, 'Invalid Driving License format (e.g., MH1420110012345)'),
  license_expiry: z.string().min(10, 'License expiry date is required'),
  notes: z.string().trim().max(500, 'Notes cannot exceed 500 characters').nullable().optional(),
  is_active: z.boolean().default(true),
}).superRefine((data, ctx) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let dobDate: Date | null = null;

  if (data.date_of_birth) {
    dobDate = new Date(data.date_of_birth);
    if (dobDate > today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Date of birth cannot be in the future',
        path: ['date_of_birth'],
      });
    } else {
      const age18 = new Date(today);
      age18.setFullYear(age18.getFullYear() - 18);
      if (dobDate > age18) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Driver must be at least 18 years old',
          path: ['date_of_birth'],
        });
      }
    }
  }

  if (data.joining_date) {
    const joiningDate = new Date(data.joining_date);
    if (joiningDate > today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Joining date cannot be in the future',
        path: ['joining_date'],
      });
    }
  }

  if (data.license_expiry && dobDate) {
    const expiryDate = new Date(data.license_expiry);
    const age18 = new Date(dobDate);
    age18.setFullYear(age18.getFullYear() + 18);
    
    if (expiryDate < age18) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'License expiry must be realistically after driver turned 18',
        path: ['license_expiry'],
      });
    }
  }
});

export type DriverFormValues = z.infer<typeof driverSchema>;
