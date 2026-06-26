import { apiClient } from '@/shared/lib/axios';
import { AUTH_CONFIG } from '@/shared/config/auth';

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

export interface UserInResponse {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  role: 'admin' | 'manager' | 'viewer';
  travel_company_id: string;
  created_at: string;
}

export interface TravelCompanyInResponse {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
}

export interface AuthResponse {
  user: UserInResponse;
  travel_company: TravelCompanyInResponse;
  tokens: TokenResponse;
}

export interface CheckSlugResponse {
  available: boolean;
  slug: string;
}

export const authApi = {
  login: async (data: Record<string, unknown>): Promise<AuthResponse> => {
    const response = await apiClient.post(AUTH_CONFIG.LOGIN_ENDPOINT, data);
    return response.data;
  },

  register: async (data: Record<string, unknown>): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  checkSlug: async (slug: string): Promise<CheckSlugResponse> => {
    const response = await apiClient.get('/auth/check-slug', {
      params: { slug },
    });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(AUTH_CONFIG.LOGOUT_ENDPOINT);
  },
};
