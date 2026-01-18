'use server'

import { createClient } from '@/lib/supabase/server'

export async function getCities() {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')
    const { data, error } = await supabase
        .from('serviceable_cities')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
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
