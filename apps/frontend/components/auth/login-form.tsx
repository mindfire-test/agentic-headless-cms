'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { loginSchema, type LoginInput } from '@repo/shared-types';

import {
  Button,
  Checkbox,
  Form,
  FormField,
  InputWrapper,
  Input,
  Separator,
} from '@repo/shared-ui';
import { API_BASE_URL } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  async function onSubmit(values: LoginInput) {
    setSubmitError(null);
    try {
      await login(values);
      router.push('/');
    } catch {
      // useAuthStore already recorded a user-facing message; read it back
      // rather than duplicating the error-shaping logic here.
      setSubmitError(
        useAuthStore.getState().error ?? 'Login failed. Please try again.',
      );
    }
  }

  function handleSsoLogin() {
    window.location.href = `${API_BASE_URL}/api/v1/auth/sso`;
  }

  return (
    <Form spacing="comfortable">
      <form
        onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
        className="grid gap-4 w-full"
      >
        <Controller
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormField>
              <label htmlFor="email">Email</label>
              <InputWrapper>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={field.value}
                  onChange={field.onChange}
                />
              </InputWrapper>
              {form.formState.errors.email?.message && (
                <p className="text-danger text-sm mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </FormField>
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormField>
              <label htmlFor="password">Password</label>
              <InputWrapper>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={field.value}
                  onChange={field.onChange}
                />
              </InputWrapper>
              {form.formState.errors.password?.message && (
                <p className="text-danger text-sm mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </FormField>
          )}
        />

        <Controller
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormField className="flex flex-row items-center gap-2 space-y-0">
              <Checkbox
                id="rememberMe"
                checked={field.value}
                onChange={field.onChange}
              />
              <label
                htmlFor="rememberMe"
                className="font-normal !mb-0 cursor-pointer"
              >
                Remember me
              </label>
            </FormField>
          )}
        />

        {submitError ? (
          <p role="alert" className="text-danger text-sm">
            {submitError}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full h-11 text-base transition-transform hover:scale-[1.02] active:scale-95"
        >
          {form.formState.isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>

        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs">or</span>
          <Separator className="flex-1" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleSsoLogin}
          className="w-full"
        >
          Sign in with SSO / OIDC
        </Button>

        <Link
          href="/forgot-password"
          className="text-muted-foreground text-center text-sm hover:underline"
        >
          Forgot password?
        </Link>
      </form>
    </Form>
  );
}
