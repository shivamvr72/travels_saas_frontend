import { RegisterForm } from '@/features/auth/components/register-form';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Register your travel company',
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your company details below to get started
        </p>
      </div>
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
