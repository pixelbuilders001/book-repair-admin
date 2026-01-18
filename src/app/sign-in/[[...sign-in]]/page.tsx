
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignIn
            routing="path"
            path="/sign-in"
            appearance={{
              elements: {
                formButtonPrimary: 'bg-primary hover:bg-primary/90',
                footerActionLink: 'text-primary hover:text-primary/90',
                card: 'shadow-none',
                headerTitle: 'text-2xl font-bold',
                headerSubtitle: 'text-sm text-muted-foreground',
                input: 'border rounded-md',
                label: 'text-sm font-medium',
                dividerLine: 'my-4',
                dividerText: 'text-sm text-muted-foreground',
                socialButtonsBlockButton: 'flex items-center justify-center gap-2',
                socialButtonsIconButton: 'p-2',
                socialButtonsButtonContent: 'text-sm',
                socialButtonsButtonText: 'text-sm font-medium',
              },
            }}
            afterSignInUrl="/"
            fallbackRedirectUrl="/"
          />
          <div className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-primary hover:text-primary/90 font-medium">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}