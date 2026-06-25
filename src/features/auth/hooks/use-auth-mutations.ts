import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '../api/auth-api';
import { useAuthStore } from '@/store/auth-store';
import { useTenantStore } from '@/store/tenant-store';
import { parseApiError } from '@/shared/lib/api-errors';

export const useLoginMutation = () => {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { setTenant } = useTenantStore();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.tokens.access_token, data.tokens.refresh_token, data.user);
      setTenant(data.travel_company);
      toast.success('Logged in successfully');
    },
    onError: (error) => {
      toast.error(parseApiError(error, 'Login failed'));
    },
  });
};

export const useRegisterMutation = () => {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { setTenant } = useTenantStore();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data.tokens.access_token, data.tokens.refresh_token, data.user);
      setTenant(data.travel_company);
      toast.success('Registration successful');
      router.push('/dashboard');
    },
    onError: (error) => {
      toast.error(parseApiError(error, 'Registration failed'));
    },
  });
};
