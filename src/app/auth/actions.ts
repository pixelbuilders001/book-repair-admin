'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    // Check if user has admin role
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

    if (profileError || profile?.role !== 'admin') {
        await supabase.auth.signOut()
        return { error: "Access denied. Only administrators can login to this panel." }
    }

    revalidatePath('/', 'layout')
    redirect('/bookings')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                intended_role: "admin",
            },
        },
    });

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    // If email confirmation is required, we might not want to redirect immediately or show a "Check email" message.
    // But standard flow often redirects to a "Verify" page.
    // user might just be signed in if 'Confirm Email' is disabled.
    // I'll return success message if not signed in immediately?
    // But typically revalidate is fine.

    // Checking session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { success: true, message: "Account created! Please check your email to confirm." }
    }

    redirect('/bookings')
}

export async function signInWithMagicLink(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string

    // Use environment variable for app URL or fallback
    const origin = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000';

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        }
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true, message: "Check your email for the magic link." }
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function getProfile() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return { data: null, error: 'Unauthorized' }

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

    return { data, error: error?.message }
}
