import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import { toast, Toaster } from "sonner";
import ImageUpload from "@/components/ui/image-upload";

type Settings = Database['public']['Tables']['settings']['Row'];

const Settings = () => {
    const [settings, setSettings] = useState<Partial<Settings>>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("en");

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data, error: _error } = await supabase
                .from('settings')
                .select('*')
                .single();

            if (data) {
                setSettings(data);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Map multilingual fields back to DB structure
            const dataToSave = {
                id: 1, // singleton
                ...settings,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('settings')
                .upsert(dataToSave);

            if (error) throw error;

            // Synchronize base fields with English localized versions for backward compatibility
            const { error: syncError } = await supabase
                .from('settings')
                .update({
                    business_name: settings.business_name_en,
                    address: settings.address_en,
                    footer_text: settings.footer_en
                })
                .eq('id', 1);

            if (syncError) console.error('Error synchronizing base fields:', syncError);

            toast.success("Settings saved successfully");
            fetchSettings();
        } catch (error) {
            console.error('Error saving settings:', error);
            const message = error instanceof Error ? error.message : "Failed to save settings";
            toast.error(message);
        } finally {
            setSubmitting(false);
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
        <div className="space-y-6 max-w-5xl">
            <Toaster />
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Website Settings</h2>
                    <p className="text-muted-foreground">
                        Manage your global website configuration
                    </p>
                </div>
                <div className="flex bg-muted p-1 rounded-md">
                    <Button
                        variant={activeTab === 'en' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('en')}
                        className="h-8 px-3"
                    >EN</Button>
                    <Button
                        variant={activeTab === 'hi' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('hi')}
                        className="h-8 px-3"
                    >HI</Button>
                    <Button
                        variant={activeTab === 'gu' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('gu')}
                        className="h-8 px-3"
                    >GU</Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-card p-6 rounded-lg border shadow-sm">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Multilingual Fields */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium border-b pb-2">Multilingual Content ({activeTab.toUpperCase()})</h3>

                        <div className="space-y-2">
                            <Label htmlFor="business_name">Business Name ({activeTab.toUpperCase()})</Label>
                            <Input
                                id="business_name"
                                value={settings[`business_name_${activeTab}` as keyof Settings] as string || ''}
                                onChange={(e) => setSettings({ ...settings, [`business_name_${activeTab}`]: e.target.value })}
                                placeholder={activeTab === 'en' ? (settings.business_name as string || "Business name") : `Business name in ${activeTab.toUpperCase()}`}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address ({activeTab.toUpperCase()})</Label>
                            <Textarea
                                id="address"
                                value={settings[`address_${activeTab}` as keyof Settings] as string || ''}
                                onChange={(e) => setSettings({ ...settings, [`address_${activeTab}`]: e.target.value })}
                                placeholder={activeTab === 'en' ? (settings.address as string || "Full address") : `Address in ${activeTab.toUpperCase()}`}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="footer_text">Footer Text ({activeTab.toUpperCase()})</Label>
                            <Textarea
                                id="footer_text"
                                value={settings[`footer_${activeTab}` as keyof Settings] as string || ''}
                                onChange={(e) => setSettings({ ...settings, [`footer_${activeTab}`]: e.target.value })}
                                placeholder={activeTab === 'en' ? (settings.footer_text as string || "Footer text") : `Footer text in ${activeTab.toUpperCase()}`}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="business_hours_days">Business Days ({activeTab.toUpperCase()})</Label>
                            <Input
                                id="business_hours_days"
                                value={settings[`business_hours_days_${activeTab}` as keyof Settings] as string || ''}
                                onChange={(e) => setSettings({ ...settings, [`business_hours_days_${activeTab}`]: e.target.value })}
                                placeholder="e.g., Mon - Sat: 9:00 AM - 7:00 PM"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="business_hours_closed">Closed/Holidays ({activeTab.toUpperCase()})</Label>
                            <Input
                                id="business_hours_closed"
                                value={settings[`business_hours_closed_${activeTab}` as keyof Settings] as string || ''}
                                onChange={(e) => setSettings({ ...settings, [`business_hours_closed_${activeTab}`]: e.target.value })}
                                placeholder="e.g., Sunday: Closed"
                            />
                        </div>
                    </div>

                    {/* Right Column: Global Fields */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium border-b pb-2">Global Information</h3>

                        <div className="space-y-2">
                            <ImageUpload
                                value={settings.logo_url || null}
                                onChange={(url) => setSettings({ ...settings, logo_url: url })}
                                bucket="settings"
                                label="Logo"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={settings.email || ''}
                                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                    placeholder="contact@example.com"
                                    autoComplete="email"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={settings.phone || ''}
                                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                    placeholder="+91 12345 67890"
                                    autoComplete="tel"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                                <Input
                                    id="whatsapp"
                                    value={settings.whatsapp || ''}
                                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                                    placeholder="+91 12345 67890"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="instagram">Instagram URL</Label>
                                <Input
                                    id="instagram"
                                    value={settings.instagram || ''}
                                    onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="facebook">Facebook URL</Label>
                                <Input
                                    id="facebook"
                                    value={settings.facebook || ''}
                                    onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                                    placeholder="https://facebook.com/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="youtube">YouTube URL</Label>
                                <Input
                                    id="youtube"
                                    value={settings.youtube || ''}
                                    onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
                                    placeholder="https://youtube.com/..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="google_map">Google Map Embed Link</Label>
                            <Input
                                id="google_map"
                                value={settings.google_map || ''}
                                onChange={(e) => setSettings({ ...settings, google_map: e.target.value })}
                                placeholder="https://www.google.com/maps/embed?..."
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t flex justify-end">
                    <Button type="submit" size="lg" disabled={submitting}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Save All Settings
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
