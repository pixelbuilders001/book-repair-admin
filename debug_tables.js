const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://upoafhtidiwsihwijwex.supabase.co'
const supabaseKey = 'sb_publishable_De7PU9kf1DOwFBC_f71xcA_3nIGlbKS'

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugData() {
    console.log("--- TABLE CHECKS ---")
    const tables = ['wallets', 'wallet', 'profile', 'profiles', 'technician', 'technicians']

    for (const table of tables) {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
        if (error) {
            console.log(`Table ${table}: Error - ${error.message}`)
        } else {
            console.log(`Table ${table}: Count - ${count}`)
        }
    }
}

debugData()
