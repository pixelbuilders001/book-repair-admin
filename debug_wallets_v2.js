const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://upoafhtidiwsihwijwex.supabase.co'
const supabaseKey = 'sb_publishable_De7PU9kf1DOwFBC_f71xcA_3nIGlbKS'

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugData() {
    console.log("--- DEBUG WALLETS ---")
    const { data: wallets, error: wError } = await supabase.from('wallets').select('*').limit(1)
    if (wError) console.log("Wallets Error:", wError.message)
    else {
        console.log("Wallets Samples:", JSON.stringify(wallets, null, 2))
    }
}

debugData()
