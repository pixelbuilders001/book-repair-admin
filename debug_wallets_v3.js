const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://upoafhtidiwsihwijwex.supabase.co'
const supabaseKey = 'sb_publishable_De7PU9kf1DOwFBC_f71xcA_3nIGlbKS'

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugData() {
    console.log("--- DEBUG WALLETS ALL ---")
    // Try to get as much as possible even if ANON
    const { data: wallets, error: wError, count } = await supabase.from('wallets').select('*', { count: 'exact' })
    if (wError) console.log("Wallets Error:", wError.message)
    else {
        console.log("Total Count from Supabase:", count)
        console.log("Data length returned:", wallets.length)
        wallets.forEach((w, i) => {
            console.log(`Row ${i}: ID=${w.id}, Mobile=${w.mobile_number}, CreatedAt=${w.created_at}`)
        })
    }
}

debugData()
