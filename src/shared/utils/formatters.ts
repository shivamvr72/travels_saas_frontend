import { format, isValid, parseISO } from 'date-fns';

export function formatCurrency(amount: number | null | undefined, currency = 'INR'): string {
  if (amount == null) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string | null | undefined, dateFormat = 'dd MMM yyyy'): string {
  if (!dateString) return '-';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  if (!isValid(date)) return '-';
  return format(date, dateFormat);
}

export function formatDateTime(dateString: string | null | undefined): string {
  return formatDate(dateString, 'dd MMM yyyy, hh:mm a');
}

export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '-';
  // simple formatting for IN numbers if 10 digits
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}

export function formatEmail(email: string | null | undefined): string {
  return email || '-';
}

export function formatCapacity(seats: number | null | undefined): string {
  if (!seats) return '-';
  return `${seats} Seats`;
}

export function formatDistance(km: number | null | undefined): string {
  if (km == null) return '-';
  return `${km.toFixed(1)} km`;
}

export function formatDuration(minutes: number | null | undefined): string {
  if (minutes == null) return '-';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

export function formatPercentage(value: number | null | undefined): string {
  if (value == null) return '-';
  return `${value.toFixed(1)}%`;
}
