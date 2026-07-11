'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Loader2 } from 'lucide-react';
import { apiClient } from '@/shared/lib/axios';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, hasHydrated, setLoading, setAuth, logout } = useAuthStore();
  const { refreshToken, user } = useAuthStore();
  const hasValidated = useRef(false);

  useEffect(() => {
    // Wait until Zustand has finished hydrating from localStorage
    if (!hasHydrated) return;
    // Only run validation once per mount
    if (hasValidated.current) return;
    hasValidated.current = true;

    const validateSession = async () => {
      // If already authenticated in memory (e.g. navigating between pages), nothing to do
      if (isAuthenticated) {
        setLoading(false);
        return;
      }

      // If we have both refreshToken and user persisted in localStorage,
      // restore the session immediately without a network call.
      // The axios interceptor will silently get a new accessToken on the first API request.
      if (refreshToken && user) {
        setAuth(useAuthStore.getState().accessToken ?? '', refreshToken, user);
        setLoading(false);
        return;
      }

      // No persisted session — try /auth/me which will trigger a token refresh via interceptor
      try {
        const response = await apiClient.get('/auth/me');
        const { accessToken: at, refreshToken: rt } = useAuthStore.getState();
        setAuth(at!, rt!, response.data);
      } catch {
        logout();
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [hasHydrated]);

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

  // Force password change interceptor
  if (user?.must_change_password && !pathname.startsWith('/profile')) {
    router.push('/profile');
    return null;
  }

  return <>{children}</>;
}
