'use server'

import { createClient } from '@/lib/supabase/server'

export async function getPlatformEarnings() {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { data, error } = await supabase
        .from('platform_earnings')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
}
