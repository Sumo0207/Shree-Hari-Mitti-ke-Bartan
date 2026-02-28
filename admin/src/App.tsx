import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Gallery from './pages/Gallery';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Testimonials from './pages/Testimonials';
import About from './pages/About';
import AdminLayout from './components/layout/AdminLayout';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Database } from './lib/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSessionAndProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            
            if (session?.user) {
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                
                if (profileError) {
                    console.error('Error fetching profile:', profileError);
                    setError('Failed to fetch user profile');
                } else {
                    setProfile(profileData);
                }
            }
            setLoading(false);
        };

        fetchSessionAndProfile();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (!session) {
                setProfile(null);
                setLoading(false);
            } else {
                // Fetch profile when session changes
                supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()
                    .then(({ data }) => {
                        setProfile(data);
                        setLoading(false);
                    });
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button 
                        onClick={() => supabase.auth.signOut()}
                        className="text-blue-500 hover:underline"
                    >
                        Sign out and try again
                    </button>
                </div>
            </div>
        );
    }

    if (profile?.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Unauthorized access. Admin privileges required.</p>
                    <button 
                        onClick={() => supabase.auth.signOut()}
                        className="text-blue-500 hover:underline"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <Routes>
                        <Route path="/login" element={<Login />} />

                        <Route path="/" element={
                            <ProtectedRoute>
                                <AdminLayout />
                            </ProtectedRoute>
                        }>
                            <Route index element={<Dashboard />} />
                            {/* Add other protected routes here */}
                            <Route path="products" element={<Products />} />
                            <Route path="categories" element={<Categories />} />
                            <Route path="gallery" element={<Gallery />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="users" element={<Users />} />
                            <Route path="testimonials" element={<Testimonials />} />
                            <Route path="about" element={<About />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
