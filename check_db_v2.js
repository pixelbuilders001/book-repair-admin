const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://upoafhtidiwsihwijwex.supabase.co'
const supabaseKey = 'sb_publishable_De7PU9kf1DOwFBC_f71xcA_3nIGlbKS'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkCounts() {
    const tables = ['booking', 'referral_bookings', 'technicians', 'profiles', 'serviceable_cities', 'wallets', 'platform_earnings', 'technician_stats']

    for (const table of tables) {
        const { count, data, error } = await supabase.from(table).select('*', { count: 'exact', head: false }).limit(5)
        if (error) {
            console.log(`Table ${table}: Error - ${error.message}`)
        } else {
            console.log(`Table ${table}: Count - ${count}, Sample size - ${data?.length}`)
        }
    }
}

checkCounts()
