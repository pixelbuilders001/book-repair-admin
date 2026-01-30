import { createClient } from './src/lib/supabase/server'

async function checkCounts() {
    const supabase = await createClient()
    const tables = ['booking', 'referral_bookings', 'technicians', 'profiles', 'serviceable_cities', 'wallets', 'platform_earnings', 'technician_stats']

    for (const table of tables) {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
        if (error) {
            console.log(`Table ${table}: Error - ${error.message}`)
        } else {
            console.log(`Table ${table}: Count - ${count}`)
        }
    }
}

checkCounts()
