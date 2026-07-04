import { differenceInDays } from 'date-fns';

export interface ExpiryAlert {
  status: 'critical' | 'warning' | 'soon' | 'valid' | 'expired' | 'missing';
  label: string;
  color: 'red' | 'orange' | 'yellow' | 'emerald' | 'slate' | 'magenta';
  daysRemaining: number;
}

export function getExpiryAlert(
  expiryDateStr: string | null | undefined,
  type: 'rc' | 'insurance' | 'fitness' | 'permit'
): ExpiryAlert {
  if (!expiryDateStr) {
    return { status: 'missing', label: 'Missing Document', color: 'slate', daysRemaining: 9999 };
  }
  
  const expiryDate = new Date(expiryDateStr);
  const today = new Date();
  
  // Normalize dates to midnight to count pure days difference
  expiryDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const daysRemaining = differenceInDays(expiryDate, today);
  
  if (daysRemaining < 0) {
    return { status: 'expired', label: 'Expired', color: 'red', daysRemaining };
  }
  
  // Custom thresholds based on industry standards & renewal times:
  // - RC (Registration Certificate): renew 60 days before (often takes 15-30 days)
  // - Insurance: critical, renew 30 days before
  // - Fitness: renew 30 days before
  // - Permit: renew 45 days before
  let redLimit = 7;
  let orangeLimit = 15;
  let yellowLimit = 30;
  
  if (type === 'rc') {
    redLimit = 15;
    orangeLimit = 30;
    yellowLimit = 60;
  } else if (type === 'permit') {
    redLimit = 10;
    orangeLimit = 20;
    yellowLimit = 45;
  }
  
  if (daysRemaining <= redLimit) {
    return { status: 'critical', label: `Expiring in ${daysRemaining} days`, color: 'red', daysRemaining };
  }
  if (daysRemaining <= orangeLimit) {
    return { status: 'warning', label: `Expiring in ${daysRemaining} days`, color: 'orange', daysRemaining };
  }
  if (daysRemaining <= yellowLimit) {
    // Magenta is specifically requested by the user as an extra visual warning code
    return { status: 'soon', label: `Expiring in ${daysRemaining} days`, color: type === 'rc' ? 'magenta' : 'yellow', daysRemaining };
  }
  
  return { status: 'valid', label: 'Active', color: 'emerald', daysRemaining };
}
