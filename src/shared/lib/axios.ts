import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from './env';
import { useAuthStore } from '@/store/auth-store';

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // Normalize url to prevent duplicate /api/v1 since it's now guaranteed in baseURL
    if (config.url?.startsWith('/api/v1')) {
      config.url = config.url.replace('/api/v1', '');
    }
    // Also strip trailing slash on endpoints to prevent redirect loops (e.g. 307 Temporary Redirects)
    if (config.url?.endsWith('/')) {
      config.url = config.url.slice(0, -1);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Silent Refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // Transparently unwrap the StandardResponse envelope to avoid breaking existing frontend code
    if (
      response.data && 
      typeof response.data === 'object' && 
      'success' in response.data && 
      'data' in response.data
    ) {
      if (response.data.success === false) {
        return Promise.reject(new Error(response.data.message || 'API Error'));
      }
      response.data = response.data.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;

      if (!refreshToken) {
        useAuthStore.getState().logout();
        isRefreshing = false;
        processQueue(error, null);
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh token using fetch to avoid circular dependency/interceptor loops
        const response = await fetch(`${env.apiBaseUrl}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!response.ok) {
          throw new Error('Refresh failed');
        }

        const data = await response.json();
        const newAccessToken = data.access_token;
        const newRefreshToken = data.refresh_token;

        // Update store
        useAuthStore.getState().setAuth(newAccessToken, newRefreshToken, useAuthStore.getState().user!);

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
