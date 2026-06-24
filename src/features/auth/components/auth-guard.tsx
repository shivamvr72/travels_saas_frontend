'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Loader2 } from 'lucide-react';
import { apiClient } from '@/shared/lib/axios';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, hasHydrated, setLoading, setAuth, logout } = useAuthStore();

  useEffect(() => {
    // Wait until Zustand has finished hydrating from localStorage
    if (!hasHydrated) return;

    const validateSession = async () => {
      // If already authenticated and we're not loading, nothing to do
      if (isAuthenticated) {
        setLoading(false);
        return;
      }

      // If we don't have a token but we have a refresh token, the axios interceptor
      // will handle the refresh automatically on our first API call to /me
      try {
        const response = await apiClient.get('/auth/me');
        setAuth(useAuthStore.getState().accessToken!, useAuthStore.getState().refreshToken!, response.data);
      } catch (error) {
        logout();
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [isAuthenticated, router, pathname, setLoading, setAuth, logout, hasHydrated]);

  if (!hasHydrated || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
