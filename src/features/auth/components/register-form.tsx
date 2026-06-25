'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegisterMutation } from '../hooks/use-auth-mutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { authApi } from '../api/auth-api';

const registerSchema = z.object({
  travel_name: z.string().min(2, 'Company name must be at least 2 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens allowed'),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  
  const registerMutation = useRegisterMutation();
  const slugCheckTimeoutRef = useRef<NodeJS.Timeout>(null);
  const userEditedSlug = useRef(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      travel_name: '',
      slug: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const travelName = form.watch('travel_name');
  const slug = form.watch('slug');

  // Auto-generate slug from travel_name
  useEffect(() => {
    if (travelName && !userEditedSlug.current) {
      const generatedSlug = travelName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      form.setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [travelName, form]);

  // Debounced slug availability check
  useEffect(() => {
    if (!slug || slug.length < 3 || !/^[a-z0-9-]+$/.test(slug)) {
      setSlugAvailable(null);
      return;
    }

    setIsCheckingSlug(true);
    setSlugAvailable(null);

    if (slugCheckTimeoutRef.current) {
      clearTimeout(slugCheckTimeoutRef.current);
    }

    slugCheckTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await authApi.checkSlug(slug);
        setSlugAvailable(response.available);
        if (!response.available) {
          form.setError('slug', { type: 'manual', message: 'This slug is already taken' });
        } else {
          form.clearErrors('slug');
        }
      } catch (error) {
        setSlugAvailable(null);
      } finally {
        setIsCheckingSlug(false);
      }
    }, 500);

    return () => {
      if (slugCheckTimeoutRef.current) clearTimeout(slugCheckTimeoutRef.current);
    };
  }, [slug, form]);

  const onSubmit = (data: RegisterFormValues) => {
    if (slugAvailable === false) return; // Prevent submission if slug is taken

    // Remove confirmPassword as the backend doesn't expect it
    const { confirmPassword, ...submitData } = data;
    registerMutation.mutate(submitData);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="travel_name">Company Name</Label>
          <Input
            id="travel_name"
            placeholder="SVR Travels"
            {...form.register('travel_name')}
            aria-invalid={!!form.formState.errors.travel_name}
          />
          {form.formState.errors.travel_name && (
            <p className="text-sm text-destructive">{form.formState.errors.travel_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Company Slug</Label>
          <div className="relative">
            <Input
              id="slug"
              placeholder="svr-travels"
              {...form.register('slug')}
              onChange={(e) => {
                userEditedSlug.current = true;
                form.register('slug').onChange(e);
              }}
              className="pr-10"
              aria-invalid={!!form.formState.errors.slug || slugAvailable === false}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isCheckingSlug ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : slugAvailable === true ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : slugAvailable === false ? (
                <XCircle className="h-4 w-4 text-destructive" />
              ) : null}
            </div>
          </div>
          {form.formState.errors.slug && (
            <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
          )}
          {slugAvailable && !form.formState.errors.slug && (
            <p className="text-xs text-green-600 dark:text-green-400">Slug is available</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            {...form.register('name')}
            aria-invalid={!!form.formState.errors.name}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@svrtravels.com"
            {...form.register('email')}
            aria-invalid={!!form.formState.errors.email}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...form.register('password')}
              aria-invalid={!!form.formState.errors.password}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {form.formState.errors.password && (
            <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...form.register('confirmPassword')}
              aria-invalid={!!form.formState.errors.confirmPassword}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={registerMutation.isPending || slugAvailable === false}
      >
        {registerMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create account'
        )}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </form>
  );
}
