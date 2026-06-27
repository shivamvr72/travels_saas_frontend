import { format, formatDistanceToNow, isValid, parseISO, differenceInDays } from 'date-fns';

// -----------------------------------------------------------------------------
// Currency & Numbers
// -----------------------------------------------------------------------------

export function formatCurrency(amount: number | string | null | undefined, currency = 'INR'): string {
  if (amount === null || amount === undefined) return '-';
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(value)) return '-';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number | string | null | undefined, decimals = 0): string {
  if (value === null || value === undefined) return '-';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '-';
  
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatPercentage(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '-';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '-';
  return `${num}%`;
}

// -----------------------------------------------------------------------------
// Dates
// -----------------------------------------------------------------------------

export function formatDate(date: string | Date | null | undefined, formatStr = 'dd MMM yyyy'): string {
  if (!date) return '-';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsedDate)) return '-';
  return format(parsedDate, formatStr);
}

export function formatDateTime(date: string | Date | null | undefined, formatStr = 'dd MMM yyyy, hh:mm a'): string {
  return formatDate(date, formatStr);
}

export function formatRelativeDate(date: string | Date | null | undefined): string {
  if (!date) return '-';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsedDate)) return '-';
  return formatDistanceToNow(parsedDate, { addSuffix: true });
}

// -----------------------------------------------------------------------------
// Contact
// -----------------------------------------------------------------------------

export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '-';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}

export function formatEmail(email: string | null | undefined): string {
  return email || '-';
}

// -----------------------------------------------------------------------------
// Transport Domain
// -----------------------------------------------------------------------------

export function formatDistance(km: string | number | null | undefined): string {
  if (km === null || km === undefined || km === '') return '-';
  return `${km} km`;
}

export function formatDuration(hours: string | number | null | undefined): string {
  if (hours === null || hours === undefined || hours === '') return '-';
  return `${hours} hrs`;
}

export function formatCapacity(seats: number | string | null | undefined): string {
  if (seats === null || seats === undefined || seats === '') return '-';
  return `${seats} Seats`;
}

export function formatVehicleReg(reg: string | null | undefined): string {
  if (!reg) return '-';
  const cleaned = reg.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (cleaned.length >= 9) {
    return cleaned.replace(/^([A-Z]{2})(\d{2})([A-Z]{1,2})(\d{4})$/, '$1-$2-$3-$4');
  }
  return cleaned;
}

export function formatGSTIN(gstin: string | null | undefined): string {
  if (!gstin) return '-';
  return gstin.toUpperCase();
}

export function formatPAN(pan: string | null | undefined): string {
  if (!pan) return '-';
  return pan.toUpperCase();
}

// -----------------------------------------------------------------------------
// Document Expiry Logic
// -----------------------------------------------------------------------------

export function getDaysUntilExpiry(expiryDate: string | Date | null | undefined): number | null {
  if (!expiryDate) return null;
  const parsedDate = typeof expiryDate === 'string' ? parseISO(expiryDate) : expiryDate;
  if (!isValid(parsedDate)) return null;
  
  return differenceInDays(parsedDate, new Date());
}

export type DocumentStatus = 'healthy' | 'expiring_soon' | 'expired' | 'unknown';

export function getDocumentStatus(expiryDate: string | Date | null | undefined, warningDays = 30): DocumentStatus {
  const daysUntil = getDaysUntilExpiry(expiryDate);
  if (daysUntil === null) return 'unknown';
  
  if (daysUntil < 0) return 'expired';
  if (daysUntil <= warningDays) return 'expiring_soon';
  return 'healthy';
}

export type LicenseStatus = 'active' | 'expiring_soon' | 'expired' | 'unknown';

export function getLicenseStatus(expiryDate: string | Date | null | undefined, warningDays = 30): LicenseStatus {
  const status = getDocumentStatus(expiryDate, warningDays);
  if (status === 'healthy') return 'active';
  return status as LicenseStatus;
}
