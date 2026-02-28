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
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Loader2, Star, CheckCircle2, XCircle } from "lucide-react";
import { toast, Toaster } from "sonner";

type Testimonial = Database['public']['Tables']['testimonials']['Row'];

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [formData, setFormData] = useState<Partial<Testimonial>>({
        is_active: false,
        rating: 5,
    });
    const [activeTab, setActiveTab] = useState<'en' | 'hi' | 'gu'>("en");
    const [submitting, setSubmitting] = useState(false);

    // Filtered testimonials based on active language
    const filteredTestimonials = testimonials.filter(testimonial => {
        const messageField = `message_${activeTab}` as keyof Testimonial;
        return !!(testimonial as any)[messageField];
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const { data, error } = await supabase
                .from('testimonials')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTestimonials(data as unknown as Testimonial[] || []);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            toast.error("Failed to load testimonials");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (testimonial?: Testimonial) => {
        if (testimonial) {
            setEditingTestimonial(testimonial);
            setFormData(testimonial);
        } else {
            setEditingTestimonial(null);
            setFormData({
                customer_name: '',
                customer_name_en: '',
                customer_name_hi: '',
                customer_name_gu: '',
                customer_location: '',
                message: '',
                message_en: '',
                message_hi: '',
                message_gu: '',
                rating: 5,
                is_active: false,
                display_order: 0,
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data = {
                ...formData,
                customer_name: formData.customer_name_en || formData.customer_name,
                message: formData.message_en || formData.message,
            };

            if (!data.customer_name) throw new Error("English Name is required");
            if (!data.message) throw new Error("English Message is required");

            if (editingTestimonial) {
                const { error } = await supabase
                    .from('testimonials')
                    .update(data)
                    .eq('id', editingTestimonial.id);

                if (error) throw error;
                toast.success("Testimonial updated successfully");
            } else {
                const { error } = await supabase
                    .from('testimonials')
                    .insert([data as any]);

                if (error) throw error;
                toast.success("Testimonial created successfully");
            }

            setIsDialogOpen(false);
            fetchTestimonials();
        } catch (error) {
            console.error('Error saving testimonial:', error);
            const message = error instanceof Error ? error.message : "Failed to save testimonial";
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;

        try {
            const { error } = await supabase
                .from('testimonials')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success("Testimonial deleted successfully");
            fetchTestimonials();
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            const message = error instanceof Error ? error.message : "Failed to delete testimonial";
            toast.error(message);
        }
    };

    const toggleStatus = async (testimonial: Testimonial) => {
        try {
            const { error } = await supabase
                .from('testimonials')
                .update({ is_active: !testimonial.is_active })
                .eq('id', testimonial.id);

            if (error) throw error;
            toast.success(testimonial.is_active ? "Testimonial unpublished" : "Testimonial published");
            fetchTestimonials();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error("Failed to update status");
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
                    <h2 className="text-3xl font-bold tracking-tight">Testimonials</h2>
                    <p className="text-muted-foreground">
                        Manage customer stories and feedback
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
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Testimonial
                    </Button>
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer ({activeTab.toUpperCase()})</TableHead>
                            <TableHead>Message ({activeTab.toUpperCase()})</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[150px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTestimonials.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No testimonials found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTestimonials.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{(item as any)[`customer_name_${activeTab}`] || item.customer_name}</span>
                                            <span className="text-xs text-muted-foreground">{item.customer_location}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-md truncate">{(item as any)[`message_${activeTab}`] || item.message}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                                            {item.rating}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleStatus(item)}
                                            className={item.is_active ? "text-green-600 hover:text-green-700 hover:bg-green-50" : "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"}
                                        >
                                            {item.is_active ? (
                                                <><CheckCircle2 className="h-4 w-4 mr-2" /> Published</>
                                            ) : (
                                                <><XCircle className="h-4 w-4 mr-2" /> Pending</>
                                            )}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleOpenDialog(item)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">Edit</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Delete</span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <div className="flex justify-between items-center">
                            <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
                        </div>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="customer_location">Location</Label>
                                    <Input
                                        id="customer_location"
                                        value={formData.customer_location || ''}
                                        onChange={(e) => setFormData({ ...formData, customer_location: e.target.value })}
                                        placeholder="e.g. Mumbai, India"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="rating">Rating (1-5)</Label>
                                        <Input
                                            id="rating"
                                            type="number"
                                            min="1"
                                            max="5"
                                            value={formData.rating || 5}
                                            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="display_order">Display Order</Label>
                                        <Input
                                            id="display_order"
                                            type="number"
                                            value={formData.display_order || 0}
                                            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 pt-4">
                                    <Switch
                                        id="is_active"
                                        checked={formData.is_active || false}
                                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                    />
                                    <Label htmlFor="is_active">Published (visible on website)</Label>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium border-b pb-2">Localized Content ({activeTab.toUpperCase()})</h3>
                                <div className="space-y-4 pt-2">
                                    <div className="space-y-2">
                                        <Label htmlFor={`customer_name_${activeTab}`}>Customer Name ({activeTab.toUpperCase()})</Label>
                                        <Input
                                            id={`customer_name_${activeTab}`}
                                            value={(formData as any)[`customer_name_${activeTab}`] || ''}
                                            onChange={(e) => setFormData({ ...formData, [`customer_name_${activeTab}`]: e.target.value })}
                                            placeholder={`Name in ${activeTab.toUpperCase()}`}
                                            required={activeTab === 'en'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`message_${activeTab}`}>Message ({activeTab.toUpperCase()})</Label>
                                        <Textarea
                                            id={`message_${activeTab}`}
                                            value={(formData as any)[`message_${activeTab}`] || ''}
                                            onChange={(e) => setFormData({ ...formData, [`message_${activeTab}`]: e.target.value })}
                                            placeholder={`Message in ${activeTab.toUpperCase()}`}
                                            rows={4}
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
                                Save Testimonial
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Testimonials;
