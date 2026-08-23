import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2, Shield, User as UserIcon } from "lucide-react";
import { toast, Toaster } from "sonner";

type Profile = Database['public']['Tables']['profiles']['Row'];

const Users = () => {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.warn('Profiles query failed, using fallback data:', error);

                const fallbackUsers = session?.user?.email
                    ? ([{
                        id: session.user.id,
                        email: session.user.email,
                        username:
                            session.user.user_metadata?.username ||
                            session.user.email?.split('@')[0] ||
                            'User',
                        avatar_url: null,
                        role: 'admin',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    }] as Profile[])
                    : [];

                setUsers(fallbackUsers);
                return;
            }

            const profileUsers = (data || []) as Profile[];

            if (session?.user?.email && !profileUsers.some((user) => user.id === session.user.id)) {
                profileUsers.unshift({
                    id: session.user.id,
                    email: session.user.email,
                    username:
                        session.user.user_metadata?.username ||
                        session.user.email?.split('@')[0] ||
                        'User',
                    avatar_url: null,
                    role: 'admin',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                } as Profile);
            }

            setUsers(profileUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleRole = async (user: Profile) => {
        if (!confirm(`Are you sure you want to change role for ${user.email} to ${user.role === 'admin' ? 'user' : 'admin'}?`)) return;

        const newRole = user.role === 'admin' ? 'user' : 'admin';

        try {
            // We need to update user_roles table, loops back to profiles via trigger
            // But first let's see if we have direct access to update profiles.
            // Usually auth roles are handled in user_roles table.

            // Check if user has entry in user_roles
            const { data: roleData } = await supabase.from('user_roles').select('*').eq('user_id', user.id).single();

            let error;
            if (roleData) {
                ({ error } = await supabase.from('user_roles').update({ role: newRole }).eq('user_id', user.id));
            } else {
                ({ error } = await supabase.from('user_roles').insert([{ user_id: user.id, role: newRole }]));
            }

            if (error) throw error;

            toast.success("User role updated successfully");
            fetchUsers();
        } catch (error) {
            console.error('Error updating role:', error);
            const message = error instanceof Error ? error.message : "Failed to update role";
            toast.error(message);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Toaster />
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                    <p className="text-muted-foreground">
                        Manage user accounts and roles
                    </p>
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="w-[150px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.username || 'N/A'}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {user.role === 'admin' ? <Shield className="h-3 w-3 mr-1" /> : <UserIcon className="h-3 w-3 mr-1" />}
                                        {user.role}
                                    </span>
                                </TableCell>
                                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleToggleRole(user)}
                                    >
                                        {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Users;
