export const API_CONFIG = {
  TIMEOUT: 30000,
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
  RETRY_COUNT: 1,
  STALE_TIME: 1000 * 60 * 5, // 5 minutes
};
