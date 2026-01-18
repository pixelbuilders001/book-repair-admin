'use client'

import { useState } from 'react'
import { login, signup } from '../auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    async function handleLogin(formData: FormData) {
        setLoading(true)
        setMessage(null)

        const res = await login(formData)
        if (res?.error) {
            setMessage({ type: 'error', text: res.error })
            setLoading(false)
        }
    }

    async function handleSignup(formData: FormData) {
        setLoading(true)
        setMessage(null)

        // Implicitly role is 'admin' via actions.ts default
        const res = await signup(formData)
        if (res?.error) {
            setMessage({ type: 'error', text: res.error })
        } else if (res?.success) {
            setMessage({ type: 'success', text: res.message || "Account created! Please check your email to confirm." })
        }
        setLoading(false)
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center space-y-1">
                    <div className="flex justify-center mb-2">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <ShieldCheck className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
                    <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="admin@example.com" required disabled={loading} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required disabled={loading} minLength={6} />
                        </div>

                        {message && (
                            <div className={`p-3 rounded-md text-sm flex items-center gap-2 ${message.type === 'error' ? 'bg-destructive/15 text-destructive' : 'bg-green-100 text-green-700'}`}>
                                {message.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                                {message.text}
                            </div>
                        )}

                        <div className="space-y-3 pt-2">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Create Admin Account
                            </Button>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or
                                    </span>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                formAction={handleLogin}
                                variant="outline"
                                className="w-full"
                                disabled={loading}>
                                Sign In
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
