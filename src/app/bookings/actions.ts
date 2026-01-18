'use server'

import { createClient } from '@/lib/supabase/server'
import { DatabaseBooking } from '@/lib/types'

export async function getBookings(): Promise<{ data?: DatabaseBooking[], error?: string }> {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    const { data: bookings, error } = await supabase
        .from('booking')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        return { error: error.message }
    }

    if (!bookings || bookings.length === 0) {
        return { data: [] }
    }

    // Extract unique IDs to minimize data fetching
    const categoryIds = Array.from(new Set(bookings.map(b => b.category_id).filter(Boolean)))
    const issueIds = Array.from(new Set(bookings.map(b => b.issue_id).filter(Boolean)))
    const technicianIds = Array.from(new Set(bookings.map(b => b.technician_id).filter(Boolean)))

    // Fetch related data
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name')
        .in('id', categoryIds)

    const { data: issues } = await supabase
        .from('issues')
        .select('id, title, icon_url')
        .in('id', issueIds)

    const { data: technicians } = await supabase
        .from('technicians')
        .select('id, full_name')
        .in('id', technicianIds)
    console.log(technicians)
    // Map data to bookings
    const enrichedBookings = bookings.map(booking => {
        const category = categories?.find(c => c.id === booking.category_id)
        const issue = issues?.find(i => i.id === booking.issue_id)
        const technician = technicians?.find(t => t.id === booking.technician_id)
        return {
            ...booking,
            category: category ? { name: category.name } : undefined,
            issue: issue ? { name: issue.title, icon_url: issue.icon_url } : undefined,
            technician: technician ? { name: technician.full_name } : undefined
        }
    })
    console.log(enrichedBookings)

    return { data: enrichedBookings }
}

export async function getTechnicians() {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    // User specified endpoint suggests table is 'technicians'
    const { data, error } = await supabase
        .from('technicians')
        .select('*')

    if (error) {
        return { error: error.message } // This signature might conflict if caller expects just data wrapper. 
        // Existing return was { data }.  Wait, previously it returned { data: ..., error: ... } potentially?
        // Checked code: returned { data } or { error }.
        // The calling code destructures response. 
    }

    return { data }
}

export async function assignTechnician(bookingId: string, technicianId: string, mapUrl: string) {
    const supabase = await createClient()
    // Verify user is authenticated with getUser
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: "Unauthorized" }

    // Get session for the token
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return { error: "Unauthorized" }


    const response = await fetch('https://upoafhtidiwsihwijwex.supabase.co/functions/v1/assign-technician', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Or strictly the one provided if different, but usually anon key works for published functions if not restricted. User provided a key in curl, let's verify if I should hardcode or use env. The user provided 'sb_publishable_De7PU9kf1DOwFBC_f71xcA_3nIGlbKS'. This looks like an anon key. I will use the env one if it matches or fall back to this if needed. For now standard env. 
        },
        body: JSON.stringify({
            booking_id: bookingId,
            technician_id: technicianId,
            map_url: mapUrl
        })
    })

    if (!response.ok) {
        const text = await response.text()
        return { error: `Failed to assign: ${text}` }
    }

    return { success: true }
}
