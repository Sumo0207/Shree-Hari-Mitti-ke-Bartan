import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Access environment variables from .env.local
// Note: In Vite, env vars must start with VITE_

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tgzlgigkfmfsxyabvelk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
    }
});
