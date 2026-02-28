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
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";

type Category = Database['public']['Tables']['categories']['Row'];

const Categories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name_en: "",
        name_hi: "",
        name_gu: ""
    });
    const [activeTab, setActiveTab] = useState<'en' | 'hi' | 'gu'>("en");
    const [submitting, setSubmitting] = useState(false);

    // Filtered categories based on active language
    const filteredCategories = categories.filter(category => {
        const nameField = `name_${activeTab}` as keyof Category;
        return !!(category as any)[nameField];
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCategories(data as unknown as Category[] || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name_en: category.name_en || "",
                name_hi: category.name_hi || "",
                name_gu: category.name_gu || ""
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name_en: "",
                name_hi: "",
                name_gu: ""
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (!formData.name_en) throw new Error("English Name is required");

            const categoryData = {
                name: formData.name_en,
                name_en: formData.name_en,
                name_hi: formData.name_hi,
                name_gu: formData.name_gu
            };

            if (editingCategory) {
                const { error } = await supabase
                    .from('categories')
                    .update(categoryData)
                    .eq('id', editingCategory.id);

                if (error) throw error;
                toast.success("Category updated successfully");
            } else {
                const { error } = await supabase
                    .from('categories')
                    .insert([categoryData]);

                if (error) throw error;
                toast.success("Category created successfully");
            }

            setIsDialogOpen(false);
            fetchCategories();
        } catch (error: any) {
            console.error('Error saving category:', error);
            toast.error(error.message || "Failed to save category");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success("Category deleted successfully");
            fetchCategories();
        } catch (error: any) {
            console.error('Error deleting category:', error);
            toast.error(error.message || "Failed to delete category");
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
                    <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
                    <p className="text-muted-foreground">
                        Manage your product categories
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
                        Add Category
                    </Button>
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name ({activeTab.toUpperCase()})</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCategories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center h-24 text-muted-foreground">
                                    No categories found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCategories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium">{(category as any)[`name_${activeTab}`] || category.name_en}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleOpenDialog(category)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">Edit</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDelete(category.id)}
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
                        <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium border-b pb-2">Localized Content ({activeTab.toUpperCase()})</h3>
                            <div className="space-y-2">
                                <Label htmlFor={`name_${activeTab}`}>Name ({activeTab.toUpperCase()})</Label>
                                <Input
                                    id={`name_${activeTab}`}
                                    value={formData[`name_${activeTab}` as keyof typeof formData] || ''}
                                    onChange={(e) => setFormData({ ...formData, [`name_${activeTab}`]: e.target.value })}
                                    placeholder={`Category Name in ${activeTab.toUpperCase()}`}
                                    required={activeTab === 'en'}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Categories;
