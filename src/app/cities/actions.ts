'use server'

import { createClient } from '@/lib/supabase/server'

export async function getCities(page: number = 1, pageSize: number = 10) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await supabase
        .from('serviceable_cities')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

    if (error) throw new Error(error.message)
    return { data, totalCount: count || 0 }
}

export async function addCity(city: { city_name: string, is_active: boolean, inspection_multiplier: number, repair_multiplier: number }) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')
    const { data, error } = await supabase
        .from('serviceable_cities')
        .insert([city])
        .select()

    if (error) throw new Error(error.message)
    return data
}

export async function toggleCityStatus(id: string, isActive: boolean) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')
    const { error } = await supabase
        .from('serviceable_cities')
        .update({ is_active: isActive })
        .eq('id', id)

    if (error) throw new Error(error.message)
    return { success: true }
}
