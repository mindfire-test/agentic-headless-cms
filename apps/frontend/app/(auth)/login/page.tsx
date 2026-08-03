import type { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/shared-ui';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Sign in — Agentic CMS',
};

export default function LoginPage() {
  return (
    <Card className="w-full shadow-2xl border-muted/30 rounded-2xl overflow-hidden backdrop-blur-sm bg-background/95 transition-all hover:shadow-primary/5">
      <CardHeader className="text-center pt-8 pb-4 space-y-3">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Agentic CMS
        </CardTitle>
        <CardDescription className="text-sm font-medium">
          Sign in to manage your content
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <LoginForm />
      </CardContent>
    </Card>
  );
}
