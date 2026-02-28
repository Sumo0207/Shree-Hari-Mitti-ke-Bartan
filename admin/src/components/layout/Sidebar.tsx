import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, FolderTree, Image, Settings, Users, LogOut, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Package, label: 'Products', href: '/products' },
    { icon: FolderTree, label: 'Categories', href: '/categories' },
    { icon: Image, label: 'Gallery', href: '/gallery' },
    { icon: MessageSquare, label: 'Testimonials', href: '/testimonials' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: Users, label: 'Users', href: '/users' },
    { icon: Package, label: 'About', href: '/about' },
];

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-50">
            <div className="h-16 flex items-center px-6 border-b border-border">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Admin Panel
                </span>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )
                        }
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-border">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </aside>
    );
};

export default Sidebar;
