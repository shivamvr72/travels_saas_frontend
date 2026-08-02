let base = process.env.NEXT_PUBLIC_API_BASE_URL || '';
if (base.endsWith('/')) base = base.slice(0, -1);
if (!base.endsWith('/api/v1') && base.length > 0) base = `${base}/api/v1`;

export const env = {
  apiBaseUrl: base,
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'SVR Travels',
} as const;

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  console.error('NEXT_PUBLIC_API_BASE_URL is missing in environment variables');
}
