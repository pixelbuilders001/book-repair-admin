'use server'

import { createClient } from '@/lib/supabase/server'
import { DatabaseBooking } from '@/lib/types'

export async function getDashboardData() {
    const supabase = await createClient()

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized')

        // Fetch data in parallel for better performance and to isolate failures
        const [
            bookingsResult,
            activeTechsResult,
            earningsResult,
            profilesCountResult,
            techniciansCountResult,
            categoriesCountResult,
            citiesCountResult,
            referralsCountResult,
            walletsCountResult
        ] = await Promise.all([
            supabase.from('booking').select('*').order('created_at', { ascending: false }),
            supabase.from('technicians').select('*', { count: 'exact', head: true }).eq('is_active', true),
            supabase.from('platform_earnings').select('commission_amount'),
            supabase.from('profiles').select('*', { count: 'exact', head: true }),
            supabase.from('technicians').select('*', { count: 'exact', head: true }),
            supabase.from('categories').select('*', { count: 'exact', head: true }),
            supabase.from('serviceable_cities').select('*', { count: 'exact', head: true }),
            supabase.from('referral_bookings').select('*', { count: 'exact', head: true }),
            supabase.from('wallets').select('*', { count: 'exact', head: true })
        ])

        const bookings = bookingsResult.data || []
        const totalBookings = bookings.length
        const totalRevenue = bookings.reduce((acc, curr) => acc + (Number(curr.final_amount_paid) || 0), 0)

        const activeTechs = activeTechsResult.count || 0
        const totalPlatformEarnings = earningsResult.data?.reduce((acc, curr) => acc + (Number(curr.commission_amount) || 0), 0) || 0

        const profilesCount = profilesCountResult.count || 0
        const techniciansCount = techniciansCountResult.count || 0
        const categoriesCount = categoriesCountResult.count || 0
        const citiesCount = citiesCountResult.count || 0
        const referralsCount = referralsCountResult.count || 0
        const walletsCount = walletsCountResult.count || 0

        // 5. Recent Bookings (Enriched)
        const recentBookingsRaw = bookings.slice(0, 5)
        let recentBookings: any[] = []

        if (recentBookingsRaw.length > 0) {
            const categoryIds = Array.from(new Set(recentBookingsRaw.map(b => b.category_id).filter(Boolean)))
            const technicianIds = Array.from(new Set(recentBookingsRaw.map(b => b.technician_id).filter(Boolean)))

            const [categoriesResp, techniciansResp] = await Promise.all([
                categoryIds.length > 0 ? supabase.from('categories').select('id, name').in('id', categoryIds) : Promise.resolve({ data: [] }),
                technicianIds.length > 0 ? supabase.from('technicians').select('id, full_name').in('id', technicianIds) : Promise.resolve({ data: [] })
            ])

            const categories = categoriesResp.data || []
            const technicians = techniciansResp.data || []

            recentBookings = recentBookingsRaw.map(booking => ({
                id: booking.id,
                customer: booking.user_name || 'N/A',
                category: categories.find(c => c.id === booking.category_id)?.name || 'N/A',
                technician: technicians.find(t => t.id === booking.technician_id)?.full_name || 'Unassigned',
                amount: `₹${booking.final_amount_to_be_paid || booking.total_estimated_price || 0}`,
                status: booking.status,
                date: new Date(booking.created_at).toLocaleDateString('en-IN')
            }))
        }

        // 6. Chart Data (Last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date()
            d.setDate(d.getDate() - i)
            return d.toISOString().split('T')[0]
        }).reverse()

        const chartData = last7Days.map(date => {
            const dayBookings = bookings.filter(b => b.created_at && b.created_at.startsWith(date))
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
                { title: "Active Techs", value: activeTechs.toString(), description: "Verified & Online", trend: "up" },
            ],
            registryCounts: [
                { title: "Profiles", count: profilesCount, href: "/profiles" },
                { title: "Categories", count: categoriesCount, href: "/categories" },
                { title: "Cities", count: citiesCount, href: "/cities" },
                { title: "Referrals", count: referralsCount, href: "/referrals" },
                { title: "Wallets", count: walletsCount, href: "/wallets" },
            ],
            recentBookings,
            chartData
        }
    } catch (error) {
        console.error('Error in getDashboardData:', error)
        // Return fallback data to prevent 500 error
        return {
            stats: [
                { title: "Total Bookings", value: "0", description: "Fetch failed", trend: "neutral" },
                { title: "Total Revenue", value: "₹0", description: "Fetch failed", trend: "neutral" },
                { title: "Platform Comm.", value: "₹0", description: "Fetch failed", trend: "neutral" },
                { title: "Active Techs", value: "0", description: "Fetch failed", trend: "neutral" },
            ],
            registryCounts: [
                { title: "Profiles", count: 0, href: "/profiles" },
                { title: "Categories", count: 0, href: "/categories" },
                { title: "Cities", count: 0, href: "/cities" },
                { title: "Referrals", count: 0, href: "/referrals" },
                { title: "Wallets", count: 0, href: "/wallets" },
            ],
            recentBookings: [],
            chartData: []
        }
    }
}
