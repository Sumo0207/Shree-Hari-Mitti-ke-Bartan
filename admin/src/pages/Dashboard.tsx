import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FolderTree, Image, Users, Loader2 } from 'lucide-react';

interface DashboardStats {
    products: number;
    categories: number;
    gallery: number;
    users: number;
}

const Dashboard = () => {
    const [stats, setStats] = useState<DashboardStats>({
        products: 0,
        categories: 0,
        gallery: 0,
        users: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [
                    { count: productsCount },
                    { count: categoriesCount },
                    { count: galleryCount },
                    { count: usersCount },
                ] = await Promise.all([
                    supabase.from('products').select('*', { count: 'exact', head: true }),
                    supabase.from('categories').select('*', { count: 'exact', head: true }),
                    supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
                    supabase.from('profiles').select('*', { count: 'exact', head: true }),
                ]);

                setStats({
                    products: productsCount || 0,
                    categories: categoriesCount || 0,
                    gallery: galleryCount || 0,
                    users: usersCount || 0,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Products',
            value: stats.products,
            icon: Package,
            description: 'Active products in catalog',
        },
        {
            title: 'Categories',
            value: stats.categories,
            icon: FolderTree,
            description: 'Product categories',
        },
        {
            title: 'Gallery Images',
            value: stats.gallery,
            icon: Image,
            description: 'Images in gallery',
        },
        {
            title: 'Total Users',
            value: stats.users,
            icon: Users,
            description: 'Registered users',
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                    Overview of your store's performance and content.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Placeholder for Recent Activity or Charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Recent product additions and updates will appear here.
                        </p>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Shortcuts to common tasks.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
