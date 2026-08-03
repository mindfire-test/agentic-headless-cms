'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@repo/shared-ui';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api-client';

export function AcceptInviteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('Invalid invitation link');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch('/api/v1/auth/accept-invite', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword: password }),
      });

      toast.success('Password set successfully. You can now log in.');
      router.push('/login');
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : 'Failed to accept invitation';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Invalid Link</CardTitle>
          <CardDescription className="text-center text-red-500">
            This invitation link is invalid or missing the token.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-2xl border-muted/30 rounded-2xl overflow-hidden backdrop-blur-sm bg-background/95 transition-all hover:shadow-primary/5">
      <CardHeader className="text-center pt-8 pb-4 space-y-3">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Set your password
        </CardTitle>
        <CardDescription className="text-sm font-medium">
          Please set a password to activate your account.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 px-8 pb-8">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(val) => setPassword(val)}
              required
              minLength={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(val) => setConfirmPassword(val)}
              required
              minLength={8}
            />
          </div>
        </CardContent>
        <CardFooter className="px-8 pb-8 pt-0">
          <Button
            type="submit"
            className="w-full h-11 text-base transition-transform hover:scale-[1.02] active:scale-95"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Activating...' : 'Activate Account'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
