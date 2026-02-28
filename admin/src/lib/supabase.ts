import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Access environment variables from the root folder's .env if possible, 
// or duplicated here. For now, assuming they are in .env in AdminPanel or hardcoded for development.
// Note: In Vite, env vars must start with VITE_

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
    }
});
