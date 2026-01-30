const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://upoafhtidiwsihwijwex.supabase.co'
const supabaseKey = 'sb_publishable_De7PU9kf1DOwFBC_f71xcA_3nIGlbKS'

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugData() {
    console.log("--- DEBUG WALLETS ---")
    const { data: wallets, error: wError, count: wCount } = await supabase.from('wallets').select('*', { count: 'exact' })
    if (wError) console.log("Wallets Error:", wError.message)
    else {
        console.log("Wallets Count:", wCount)
        console.log("Wallets Samples:", JSON.stringify(wallets, null, 2))
    }

    console.log("\n--- DEBUG PROFILES ---")
    const { data: profiles, error: pError } = await supabase.from('profiles').select('*').limit(1)
    if (pError) console.log("Profiles Error:", pError.message)
    else if (profiles && profiles.length > 0) {
        console.log("Profiles Keys:", Object.keys(profiles[0]))
    }

    console.log("\n--- DEBUG TECHNICIANS ---")
    const { data: techs, error: tError } = await supabase.from('technicians').select('*').limit(1)
    if (tError) console.log("Techs Error:", tError.message)
    else if (techs && techs.length > 0) {
        console.log("Techs Keys:", Object.keys(techs[0]))
    }
}

debugData()
