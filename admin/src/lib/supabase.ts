import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Access environment variables from the root folder's .env if possible, 
// or duplicated here. For now, assuming they are in .env in AdminPanel or hardcoded for development.
// Note: In Vite, env vars must start with VITE_

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

let supabase: any = null;

if (!supabaseUrl || !supabaseAnonKey) {
    // Graceful fallback when env vars are missing — avoids import-time crash.
    console.warn('Missing Supabase environment variables. Admin UI will run in limited offline mode.');

    // Minimal stub implementing parts of the Supabase client used by the admin UI.
    const noop = async () => ({ data: null, error: null });
    supabase = {
        auth: {
            getSession: async () => ({ data: { session: null } }),
            onAuthStateChange: (_cb: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
        },
        from: (_table: string) => ({
            select: async () => ({ data: [], error: null }),
            insert: noop,
            update: noop,
            delete: noop,
            eq: () => ({ select: async () => ({ data: [], error: null }) }),
        }),
        storage: {
            from: () => ({ upload: noop, download: noop, list: async () => ({ data: [], error: null }) }),
        },
    };
} else {
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
            storage: localStorage,
            persistSession: true,
            autoRefreshToken: true,
        }
    });
}

export { supabase };
