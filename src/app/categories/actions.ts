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
