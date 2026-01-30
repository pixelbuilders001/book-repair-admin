'use server'

import { createClient } from '@/lib/supabase/server'

export async function getReferralBookings(page: number = 1, pageSize: number = 10) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await supabase
        .from('referral_bookings')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

    if (error) throw new Error(error.message)
    return { data, totalCount: count || 0 }
}
