'use server'

import { createClient } from '@/lib/supabase/server'
import { DatabaseBooking } from '@/lib/types'

export async function getDashboardData() {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    // 1. Fetch Bookings and calculate stats
    const { data: bookings, error: bookingError } = await supabase
        .from('booking')
        .select('*')
        .order('created_at', { ascending: false })

    if (bookingError) throw new Error(bookingError.message)

    const totalBookings = bookings?.length || 0
    const totalRevenue = bookings?.reduce((acc, curr) => acc + (Number(curr.final_amount_paid) || 0), 0) || 0

    // 2. Fetch Active Technicians
    const { count: activeTechs } = await supabase
        .from('technicians')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

    // 3. Fetch Platform Earnings
    const { data: earnings } = await supabase
        .from('platform_earnings')
        .select('commission_amount')

    const totalPlatformEarnings = earnings?.reduce((acc, curr) => acc + (Number(curr.commission_amount) || 0), 0) || 0

    // 4. Counts for other tabs
    const { count: profilesCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    const { count: techniciansCount } = await supabase.from('technicians').select('*', { count: 'exact', head: true })
    const { count: categoriesCount } = await supabase.from('categories').select('*', { count: 'exact', head: true })
    const { count: citiesCount } = await supabase.from('serviceable_cities').select('*', { count: 'exact', head: true })
    const { count: referralsCount } = await supabase.from('referral_bookings').select('*', { count: 'exact', head: true })
    const { count: walletsCount } = await supabase.from('wallets').select('*', { count: 'exact', head: true })

    // 5. Recent Bookings (Enriched like in bookings/actions.ts)
    const recentBookingsRaw = bookings?.slice(0, 5) || []

    // Enriching recent bookings
    const categoryIds = Array.from(new Set(recentBookingsRaw.map(b => b.category_id).filter(Boolean)))
    const issueIds = Array.from(new Set(recentBookingsRaw.map(b => b.issue_id).filter(Boolean)))
    const technicianIds = Array.from(new Set(recentBookingsRaw.map(b => b.technician_id).filter(Boolean)))

    const { data: categories } = await supabase.from('categories').select('id, name').in('id', categoryIds)
    const { data: issues } = await supabase.from('issues').select('id, title').in('id', issueIds)
    const { data: technicians } = await supabase.from('technicians').select('id, full_name').in('id', technicianIds)

    const recentBookings = recentBookingsRaw.map(booking => ({
        id: booking.id,
        customer: booking.user_name || 'N/A',
        category: categories?.find(c => c.id === booking.category_id)?.name || 'N/A',
        technician: technicians?.find(t => t.id === booking.technician_id)?.full_name || 'Unassigned',
        amount: `₹${booking.final_amount_to_be_paid || booking.total_estimated_price || 0}`,
        status: booking.status,
        date: new Date(booking.created_at).toLocaleDateString('en-IN')
    }))

    // 6. Chart Data (Last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - i)
        return d.toISOString().split('T')[0]
    }).reverse()

    const chartData = last7Days.map(date => {
        const dayBookings = bookings?.filter(b => b.created_at.startsWith(date)) || []
        const revenue = dayBookings.reduce((acc, curr) => acc + (Number(curr.final_amount_paid) || 0), 0)
        const dayName = new Date(date).toLocaleDateString('en-IN', { weekday: 'short' })
        return {
            name: dayName,
            bookings: dayBookings.length,
            revenue: revenue
        }
    })

    return {
        stats: [
            { title: "Total Bookings", value: totalBookings.toLocaleString(), description: "All time records", trend: "up" },
            { title: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, description: "Gross booking revenue", trend: "up" },
            { title: "Platform Comm.", value: `₹${totalPlatformEarnings.toLocaleString()}`, description: "Net platform earnings", trend: "up" },
            { title: "Active Techs", value: (activeTechs || 0).toString(), description: "Verified & Online", trend: "up" },
        ],
        registryCounts: [
            { title: "Profiles", count: profilesCount || 0, href: "/profiles" },
            { title: "Categories", count: categoriesCount || 0, href: "/categories" },
            { title: "Cities", count: citiesCount || 0, href: "/cities" },
            { title: "Referrals", count: referralsCount || 0, href: "/referrals" },
            { title: "Wallets", count: walletsCount || 0, href: "/wallets" },
        ],
        recentBookings,
        chartData
    }
}
