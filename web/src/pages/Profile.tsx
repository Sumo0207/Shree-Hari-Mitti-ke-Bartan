
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';

const Profile = () => {
    const { user, profile, refreshProfile } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [username, setUsername] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        if (profile) {
            setUsername(profile.username || '');
            setAvatarUrl(profile.avatar_url);
        }
    }, [profile]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            const updates = {
                id: user.id,
                email: user.email!,
                username,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) throw error;

            await refreshProfile();

            toast({
                title: "Profile updated",
                description: "Your profile has been updated successfully.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to update profile.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars') // Make sure this bucket exists
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

            if (data) {
                setAvatarUrl(data.publicUrl);
                // Auto update profile with new avatar
                const updates = {
                    id: user?.id,
                    email: user.email!,
                    avatar_url: data.publicUrl,
                    updated_at: new Date().toISOString(),
                };

                const { error: updateError } = await supabase.from('profiles').upsert(updates);
                if (updateError) throw updateError;

                await refreshProfile();

                toast({
                    title: "Avatar updated",
                    description: "Your profile picture has been updated.",
                });
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        } finally {
            setUploading(false);
        }
    };

    if (!user) return null;

    return (
        <PageTransition>
            <div className="container mx-auto py-10 px-4">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Profile Settings</CardTitle>
                        <CardDescription>Manage your account settings and preferences.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex flex-col items-center space-y-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={avatarUrl || ''} />
                                    <AvatarFallback className="text-2xl">
                                        {username?.substring(0, 2).toUpperCase() || user.email?.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex items-center">
                                    <Label htmlFor="avatar-upload" className="cursor-pointer bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md transition-colors flex items-center gap-2 text-sm">
                                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                        Change Avatar
                                    </Label>
                                    <Input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarUpload}
                                        disabled={uploading}
                                    />
                                </div>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="flex-1 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" value={user.email} disabled className="bg-muted" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Your username"
                                    />
                                </div>
                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageTransition>
    );
};

export default Profile;
