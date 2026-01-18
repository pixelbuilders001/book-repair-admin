'use server'

import { createClient } from '@/lib/supabase/server'

export async function getTechnicians() {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { data, error } = await supabase
        .from('technicians')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
}

export async function getTechnicianById(id: string) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { data, error } = await supabase
        .from('technicians')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw new Error(error.message)
    return data
}

export async function verifyTechnician(id: string, updates: { is_verified?: boolean, verification_status?: string, remark?: string }) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('technicians')
        .update(updates)
        .eq('id', id)


    if (error) throw new Error(error.message)
    return { success: true }
}
