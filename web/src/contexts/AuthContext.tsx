import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';
import { isAdminUser } from '@/lib/adminAccess';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: Profile | null;
    isAdmin: boolean;
    loading: boolean;
    event: AuthChangeEvent | null;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    profile: null,
    isAdmin: false,
    loading: true,
    event: null,
    signOut: async () => { },
    refreshProfile: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState<AuthChangeEvent | null>(null);
    const fetchingRef = useRef(false);
    const lastFetchTimeRef = useRef(0);

    const fetchProfile = useCallback(async (userId: string) => {
        // Prevent multiple simultaneous fetches and rate limiting
        if (fetchingRef.current) return;
        
        const now = Date.now();
        const timeSinceLastFetch = now - lastFetchTimeRef.current;
        
        // Minimum 2 seconds between fetches to avoid rate limiting
        if (timeSinceLastFetch < 2000) {
            console.log('Skipping profile fetch - rate limited');
            return;
        }
        
        fetchingRef.current = true;
        lastFetchTimeRef.current = now;
        
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                // If profile doesn't exist, create a basic profile from user data
                if (error.code === 'PGRST116') {
                    console.log('Profile not found, using fallback');
                    // Don't try to insert - let the database trigger handle it
                    // Just set a fallback profile
                    setProfile({
                        id: userId,
                        email: session?.user?.email || '',
                        username: session?.user?.user_metadata?.username || session?.user?.email?.split('@')[0] || 'User',
                        avatar_url: null,
                        theme_preference: 'light',
                        role: 'user',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    } as Profile);
                }
            } else {
                setProfile(data);
            }
        } catch (error) {
            console.error('Error in fetchProfile:', error);
        } finally {
            fetchingRef.current = false;
            setLoading(false);
        }
    }, [session?.user?.email, session?.user?.user_metadata?.username]);

    const refreshProfile = useCallback(async () => {
        if (user?.id) {
            lastFetchTimeRef.current = 0; // Reset rate limit for manual refresh
            await fetchProfile(user.id);
        }
    }, [user?.id, fetchProfile]);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((evt, session) => {
            setEvent(evt);
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                // Reset rate limit on auth state change
                lastFetchTimeRef.current = 0;
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [fetchProfile]);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const isAdmin = isAdminUser(profile?.role, user?.email);

    return (
        <AuthContext.Provider value={{ session, user, profile, isAdmin, loading, event, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
