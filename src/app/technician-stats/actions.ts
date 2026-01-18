'use server'

import { createClient } from '@/lib/supabase/server'

export async function getTechnicianStats() {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { data, error } = await supabase
        .from('technician_stats')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    console.log("stats---", data)
    return data
}
