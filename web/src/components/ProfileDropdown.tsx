import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import {
    User,
    LogOut,
    LayoutDashboard,
    Sun,
    Moon,
    Loader2
} from "lucide-react";

export function ProfileDropdown() {
    const { user, profile, isAdmin, signOut, loading } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();

    if (!user) return null;

    // Show loading state while profile is being fetched
    if (loading && !profile) {
        return (
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
        );
    }

    const initials = profile?.username
        ? profile.username.substring(0, 2).toUpperCase()
        : user.email?.substring(0, 2).toUpperCase() || "U";

    const handleLogout = async () => {
        await signOut();
        navigate("/");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || ""} alt={profile?.username || "User"} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile?.username || user.email?.split('@')[0] || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                )}

                <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                    {theme === "light" && <span className="ml-auto text-xs">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                    {theme === "dark" && <span className="ml-auto text-xs">✓</span>}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
