'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getTechnicians(page: number = 1, pageSize: number = 10) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await supabase
        .from('technicians')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

    if (error) throw new Error(error.message)
    return { data, totalCount: count || 0 }
}

export async function getTechnicianById(id: string) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Unauthorized')

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/technicians?id=eq.${id}&select=*`, {
        headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        }
    })

    if (!response.ok) {
        throw new Error('Failed to fetch technician')
    }

    const data = await response.json()
    console.log("hfhhfhf", data)
    return data[0]
}

export async function updateTechnician(id: string, updates: Partial<{ is_verified: boolean, is_active: boolean }>) {
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
        throw new Error("Unauthorized")
    }

    const accessToken = session.access_token

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/technicians?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({
            ...updates,
            updated_at: new Date().toISOString()
        })
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update technician.')
    }

    revalidatePath('/technicians')
    return { success: true }
}

export async function verifyTechnician(id: string, action: 'approved' | 'rejected', remarks: string) {
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
        throw new Error("Unauthorized")
    }

    const accessToken = session.access_token
    // Using provided credentials for the Edge Function
    const FUNCTION_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/verify-technician`
    const AUTH_KEY = "sb_publishable_De7PU9kf1DOwFBC_f71xcA_3nIGlbKS"

    const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'apikey': AUTH_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            technician_id: id,
            action,
            remarks
        })
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to verify technician.')
    }

    revalidatePath('/technicians')
    return { success: true }
}
