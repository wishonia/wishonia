import {createClient} from '@supabase/supabase-js';

export function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
        throw new Error('Missing environment variable SUPABASE_URL');
    }

    if (!supabaseServiceKey) {
        throw new Error('Missing environment variable SUPABASE_SERVICE_ROLE_KEY');
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        db: {schema: 'docs'},
        auth: {
            persistSession: true,
            autoRefreshToken: true
        }
    });
}