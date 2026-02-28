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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, RefreshCw } from "lucide-react";
import { toast, Toaster } from "sonner";
import ImageUpload from "@/components/ui/image-upload";

type AboutContent = Database['public']['Tables']['about_content']['Row'];

const About = () => {
    const [content, setContent] = useState<AboutContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<AboutContent | null>(null);
    const [formData, setFormData] = useState<Partial<AboutContent>>({});
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'en' | 'hi' | 'gu'>("en");

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('about_content')
                .select('*')
                .order('section_key');

            if (error) throw error;
            setContent(data || []);
        } catch (error) {
            console.error('Error fetching about content:', error);
            toast.error("Failed to load about content");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (item: AboutContent) => {
        setEditingItem(item);
        setFormData(item);
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;
        setSubmitting(true);

        try {
            const { error } = await supabase
                .from('about_content')
                .update({
                    title: formData.title_en || formData.title,
                    title_en: formData.title_en,
                    title_hi: formData.title_hi,
                    title_gu: formData.title_gu,
                    content: formData.content_en || formData.content,
                    content_en: formData.content_en,
                    content_hi: formData.content_hi,
                    content_gu: formData.content_gu,
                    image_url: formData.image_url,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', editingItem.id);

            if (error) throw error;

            toast.success("Content updated successfully");
            setIsDialogOpen(false);
            fetchContent();
        } catch (error) {
            console.error('Error saving content:', error);
            toast.error("Failed to save content");
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
        <div className="space-y-6">
            <Toaster />
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">About Us Content</h2>
                    <p className="text-muted-foreground">
                        Manage the information displayed on the About page
                    </p>
                </div>
                <div className="flex items-center gap-4">
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
                    <Button variant="outline" onClick={fetchContent}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Section Key</TableHead>
                            <TableHead>Title ({activeTab.toUpperCase()})</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {content.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No content sections found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            content.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-mono text-xs">{item.section_key}</TableCell>
                                    <TableCell className="font-medium">{(item as any)[`title_${activeTab}`] || item.title || '(No Title)'}</TableCell>
                                    <TableCell>
                                        <div className="h-10 w-16 rounded bg-muted overflow-hidden">
                                            {item.image_url && <img src={item.image_url} alt="" className="h-full w-full object-cover" />}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'Never'}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleOpenDialog(item)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Section: {editingItem?.section_key}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <ImageUpload
                                        value={formData.image_url || null}
                                        onChange={(url) => setFormData({ ...formData, image_url: url })}
                                        bucket="about"
                                        label="Section Image"
                                    />
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg border">
                                    <h4 className="font-medium mb-2">Section Key</h4>
                                    <p className="font-mono text-sm">{editingItem?.section_key}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium border-b pb-2">Localized Content ({activeTab.toUpperCase()})</h3>
                                <div className="space-y-4 pt-2">
                                    <div className="space-y-2">
                                        <Label htmlFor={`title_${activeTab}`}>Title ({activeTab.toUpperCase()})</Label>
                                        <Input
                                            id={`title_${activeTab}`}
                                            value={(formData as any)[`title_${activeTab}`] || ''}
                                            onChange={(e) => setFormData({ ...formData, [`title_${activeTab}`]: e.target.value })}
                                            placeholder={`Title in ${activeTab.toUpperCase()}`}
                                            required={activeTab === 'en'}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={`content_${activeTab}`}>Content ({activeTab.toUpperCase()})</Label>
                                        <Textarea
                                            id={`content_${activeTab}`}
                                            value={(formData as any)[`content_${activeTab}`] || ''}
                                            onChange={(e) => setFormData({ ...formData, [`content_${activeTab}`]: e.target.value })}
                                            placeholder={`Content in ${activeTab.toUpperCase()}`}
                                            rows={8}
                                            required={activeTab === 'en'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default About;
