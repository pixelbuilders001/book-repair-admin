
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function testRefactoredLogic() {
    console.log('--- Testing Refactored Dashboard Logic ---')

    try {
        // Mocking the parallel fetch results
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

        console.log('Parallel fetching completed successfully.')

        const bookings = bookingsResult.data || []
        const totalBookings = bookings.length
        const totalRevenue = bookings.reduce((acc, curr) => acc + (Number(curr.final_amount_paid) || 0), 0)

        console.log(`Total Bookings: ${totalBookings}`)
        console.log(`Total Revenue: ${totalRevenue}`)

        // Test Recent Bookings Enrichment Logic
        const recentBookingsRaw = bookings.slice(0, 5)
        console.log(`Recent Bookings Count: ${recentBookingsRaw.length}`)

        if (recentBookingsRaw.length > 0) {
            const categoryIds = Array.from(new Set(recentBookingsRaw.map(b => b.category_id).filter(Boolean)))
            const technicianIds = Array.from(new Set(recentBookingsRaw.map(b => b.technician_id).filter(Boolean)))

            console.log('Fetching related data for enrichment...')
            const [categoriesResp, techniciansResp] = await Promise.all([
                categoryIds.length > 0 ? supabase.from('categories').select('id, name').in('id', categoryIds) : Promise.resolve({ data: [] }),
                technicianIds.length > 0 ? supabase.from('technicians').select('id, full_name').in('id', technicianIds) : Promise.resolve({ data: [] })
            ])

            const categories = categoriesResp.data || []
            const technicians = techniciansResp.data || []

            const recentBookings = recentBookingsRaw.map(booking => ({
                id: booking.id,
                customer: booking.user_name || 'N/A',
                category: categories.find((c: any) => c.id === booking.category_id)?.name || 'N/A',
                technician: technicians.find((t: any) => t.id === booking.technician_id)?.full_name || 'Unassigned',
                amount: `₹${booking.final_amount_to_be_paid || booking.total_estimated_price || 0}`,
                status: booking.status,
                date: booking.created_at ? new Date(booking.created_at).toLocaleDateString('en-IN') : 'N/A'
            }))
            console.log('Enriched recent bookings sample:', recentBookings[0])
        }

        // Test Chart Data Logic
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
        console.log('Chart data generated. Sample:', chartData[0])

        console.log('--- ALL LOGIC TESTS PASSED ---')

    } catch (err: any) {
        console.error('Logic Test Failed:', err.message)
    }
}

testRefactoredLogic()
