'use server'

import { createClient } from '@/lib/supabase/server'

export async function getCategoriesWithIssues() {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    // Fetch categories
    const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false })

    if (catError) throw new Error(catError.message)
    if (!categories) return []

    // Fetch all active issues
    const { data: issues, error: issueError } = await supabase
        .from('issues')
        .select('*')
        .eq('is_active', true)

    if (issueError) throw new Error(issueError.message)

    // Map issues to categories
    // Note: Doing this in JS to avoid complex joins and because we want all active issues
    const categoriesWithIssues = categories.map(cat => ({
        ...cat,
        issues: issues?.filter(issue => issue.category_id === cat.id) || []
    }))

    return categoriesWithIssues
}

export async function addCategory(categoryData: {
    name: string
    slug: string
    description?: string
    icon_url?: string
    is_active: boolean
    base_inspection_fee?: number
    sort_order?: number
}) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single()

    if (error) throw new Error(error.message)

    // Create default "Other / Not sure" issue for the new category
    const defaultIssue = {
        category_id: data.id,
        title: 'Other / Not sure',
        description: 'Select this if your issue is not listed or you are not sure',
        is_active: true,
        sort_order: 999,
    }

    const { error: issueError } = await supabase
        .from('issues')
        .insert([defaultIssue])

    if (issueError) {
        console.error('Failed to create default issue:', issueError.message)
    }

    return data
}

export async function updateCategory(id: string, categoryData: {
    name?: string
    slug?: string
    description?: string
    icon_url?: string
    is_active?: boolean
    base_inspection_fee?: number
    sort_order?: number
}) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { data, error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id)
        .select()
        .single()

    if (error) throw new Error(error.message)

    return data
}

export async function deleteCategory(id: string) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

    if (error) throw new Error(error.message)

    return { success: true }
}

export async function addIssue(issueData: {
    category_id: string
    title: string
    description?: string
    icon_url?: string
    estimated_price?: number
    base_min_fee?: number
    is_active: boolean
    sort_order?: number
}) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { data, error } = await supabase
        .from('issues')
        .insert([issueData])
        .select()
        .single()

    if (error) throw new Error(error.message)

    return data
}

export async function updateIssue(id: string, issueData: {
    title?: string
    description?: string
    icon_url?: string
    estimated_price?: number
    base_min_fee?: number
    is_active?: boolean
    sort_order?: number
}) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { data, error } = await supabase
        .from('issues')
        .update(issueData)
        .eq('id', id)
        .select()
        .single()

    if (error) throw new Error(error.message)

    return data
}

export async function deleteIssue(id: string) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('issues')
        .delete()
        .eq('id', id)

    if (error) throw new Error(error.message)

    return { success: true }
}
