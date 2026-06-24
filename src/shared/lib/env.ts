export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL!,
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'SVR Travels',
} as const;

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  console.error('NEXT_PUBLIC_API_BASE_URL is missing in environment variables');
}
