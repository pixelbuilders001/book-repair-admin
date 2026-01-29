'use server'

import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export async function getProfiles() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Unauthorized')

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles`, {
        headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        }
    })

    if (!response.ok) {
        throw new Error('Failed to fetch profiles')
    }

    return await response.json() as Profile[]
}

export async function updateProfile(id: string, updates: Partial<Profile>) {
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
        throw new Error("Unauthorized")
    }

    const accessToken = session.access_token
    // Remove id and updated_at from payload to ensure it doesn't cause issues during PATCH
    const { id: _, updated_at: __, ...payload } = updates

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({
            ...payload,
            updated_at: new Date().toISOString()
        })
    })
    const updated = await response.json()
    console.log('Updated row:', updated)

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update profile.')
    }

    revalidatePath('/profiles')

    return { success: true }
}

export async function getProfile(id: string) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Unauthorized')

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?id=eq.${id}&select=*`, {
        headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        }
    })

    if (!response.ok) {
        throw new Error('Failed to fetch profile')
    }

    const data = await response.json()
    return data[0] as Profile
}
