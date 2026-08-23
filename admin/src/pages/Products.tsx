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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff, Star } from "lucide-react";
import { toast, Toaster } from "sonner";
import ImageUpload from "@/components/ui/image-upload";


type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<any>({
        visible: true,
        is_featured: false,
    });
    const [submitting, setSubmitting] = useState(false);
    const [formLanguageTab, setFormLanguageTab] = useState<'en' | 'hi' | 'gu'>("en");

    const [activeTab, setActiveTab] = useState<'en' | 'hi' | 'gu'>("en");

    // Filtered products based on active language
    const filteredProducts = products.filter(product => {
        const nameField = `name_${activeTab}` as keyof Product;
        return !!(product as any)[nameField];
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [productsResult, categoriesResult] = await Promise.all([
                supabase.from('products').select('*').order('created_at', { ascending: false }),
                supabase.from('categories').select('*').order('created_at', { ascending: false }) // Sort categories too?
            ]);

            if (productsResult.error) throw productsResult.error;
            if (categoriesResult.error) throw categoriesResult.error;

            setProducts(productsResult.data as unknown as Product[] || []);
            setCategories(categoriesResult.data as unknown as Category[] || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData(product);
        } else {
            setEditingProduct(null);
            setFormData({
                visible: true,
                is_featured: false,
                name_en: '', name_hi: '', name_gu: '',
                description_en: '', description_hi: '', description_gu: '',
                story_en: '', story_hi: '', story_gu: '',
                category_id: null,
                image_url: null,
                size: '',
                material: '',
                how_to_use_en: '',
                how_to_use_hi: '',
                how_to_use_gu: ''
            });
        }
        setFormLanguageTab('en'); // Reset to English tab when opening dialog
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Validate all three language names are required
            if (!formData.name_en) throw new Error("English Name is required");
            if (!formData.name_hi) throw new Error("Hindi Name is required");
            if (!formData.name_gu) throw new Error("Gujarati Name is required");
            if (!formData.category_id) throw new Error("Category is required");

            // We need to ensure types match Database['public']['Tables']['products']['Insert']
            // Filtering out properties that are in Row but not in Insert/Update
            const {
                id: _id,
                created_at: _created_at,
                updated_at: _updated_at,
                name: currentName,
                description: currentDesc,
                ...rest
            } = formData;

            const productData = {
                ...rest,
            };

            const data = {
                ...productData,
                name: (productData as any).name_en || currentName,
                description: (productData as any).description_en || currentDesc,
                // Ensure localized name fields are not null for the DB if it expects string | undefined
                name_en: (productData as any).name_en || undefined,
                name_hi: (productData as any).name_hi || undefined,
                name_gu: (productData as any).name_gu || undefined,
                description_en: (productData as any).description_en || undefined,
                description_hi: (productData as any).description_hi || undefined,
                description_gu: (productData as any).description_gu || undefined,
                story_en: (productData as any).story_en || undefined,
                story_hi: (productData as any).story_hi || undefined,
                story_gu: (productData as any).story_gu || undefined,
                how_to_use_en: (productData as any).how_to_use_en || undefined,
                how_to_use_hi: (productData as any).how_to_use_hi || undefined,
                how_to_use_gu: (productData as any).how_to_use_gu || undefined,
            };

            if (editingProduct) {
                const { error } = await supabase
                    .from('products')
                    .update(data as any)
                    .eq('id', editingProduct.id);

                if (error) throw error;
                toast.success("Product updated successfully");
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([data as any]);

                if (error) throw error;
                toast.success("Product created successfully");
            }

            setIsDialogOpen(false);
            fetchInitialData();
        } catch (error) {
            console.error('Error saving product:', error);
            const message = error instanceof Error ? error.message : "Failed to save product";
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success("Product deleted successfully");
            fetchInitialData();
        } catch (error) {
            console.error('Error deleting product:', error);
            const message = error instanceof Error ? error.message : "Failed to delete product";
            toast.error(message);
        }
    };

    const getCategoryName = (id: string | null) => {
        if (!id) return 'Uncategorized';
        const category = categories.find(c => c.id === id);
        if (!category) return 'Unknown';
        return (category as any)[`name_${activeTab}`] || category.name_en || 'Unknown';
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
                    <h2 className="text-3xl font-bold tracking-tight">Products</h2>
                    <p className="text-muted-foreground">
                        Manage your product catalog
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
                        Add Product
                    </Button>
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Name ({activeTab.toUpperCase()})</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Visible</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="h-10 w-10 rounded-md bg-muted overflow-hidden">
                                            {product.image_url && <img src={product.image_url} alt={(product as any)[`name_${activeTab}`] || product.name_en || ""} className="h-full w-full object-cover" />}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{(product as any)[`name_${activeTab}`] || product.name_en}</span>
                                            {product.is_featured && <span className="text-xs text-yellow-600 flex items-center"><Star className="h-3 w-3 mr-1 fill-yellow-600" /> Featured</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getCategoryName(product.category_id)}</TableCell>
                                    <TableCell>
                                        {product.visible ? <Eye className="h-4 w-4 text-green-500" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleOpenDialog(product)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">Edit</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDelete(product.id)}
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
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            Add product image once and enter details in all three languages
                        </p>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Common Fields - Image and Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <ImageUpload
                                        value={formData.image_url || null}
                                        onChange={(url) => setFormData({ ...formData, image_url: url })}
                                        label="Product Image (Shared across all languages)"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="size">Size</Label>
                                        <Input
                                            id="size"
                                            value={formData.size || ''}
                                            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                            placeholder="e.g. 10x10 cm"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="material">Material</Label>
                                        <Input
                                            id="material"
                                            value={formData.material || ''}
                                            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                                            placeholder="e.g. Clay"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="material">Material</Label>
                                        <Input
                                            id="material"
                                            value={formData.material || ''}
                                            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                                            placeholder="e.g. Clay"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="visible"
                                                checked={formData.visible}
                                                onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
                                            />
                                            <Label htmlFor="visible">Visible</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="featured"
                                                checked={formData.is_featured || false}
                                                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                                            />
                                            <Label htmlFor="featured">Featured</Label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Multilingual Fields with Tabs */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium border-b pb-2">Product Details (All Languages)</h3>
                                <Tabs value={formLanguageTab} onValueChange={(v) => setFormLanguageTab(v as 'en' | 'hi' | 'gu')}>
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="en">English</TabsTrigger>
                                        <TabsTrigger value="hi">हिंदी</TabsTrigger>
                                        <TabsTrigger value="gu">ગુજરાતી</TabsTrigger>
                                    </TabsList>
                                    
                                    {/* English Tab */}
                                    <TabsContent value="en" className="space-y-4 mt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="category_en">Category (English)</Label>
                                            <Select
                                                value={formData.category_id || undefined}
                                                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id}>
                                                            {category.name_en}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="name_en">Name (English) <span className="text-destructive">*</span></Label>
                                            <Input
                                                id="name_en"
                                                value={formData.name_en || ''}
                                                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                                                placeholder="Product Name in English"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description_en">Description (English)</Label>
                                            <Textarea
                                                id="description_en"
                                                value={formData.description_en || ''}
                                                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                                                placeholder="Description in English"
                                                rows={4}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="story_en">Story (English)</Label>
                                            <Textarea
                                                id="story_en"
                                                value={formData.story_en || ''}
                                                onChange={(e) => setFormData({ ...formData, story_en: e.target.value })}
                                                placeholder="Story in English"
                                                rows={3}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="how_to_use_en">How to Use (English)</Label>
                                            <Textarea
                                                id="how_to_use_en"
                                                value={formData.how_to_use_en || ''}
                                                onChange={(e) => setFormData({ ...formData, how_to_use_en: e.target.value })}
                                                placeholder="How to use this product in English"
                                                rows={4}
                                            />
                                        </div>
                                    </TabsContent>
                                    
                                    {/* Hindi Tab */}
                                    <TabsContent value="hi" className="space-y-4 mt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="category_hi">श्रेणी (Hindi)</Label>
                                            <Select
                                                value={formData.category_id || undefined}
                                                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="श्रेणी चुनें" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id}>
                                                            {category.name_hi}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="name_hi">Name (Hindi) <span className="text-destructive">*</span></Label>
                                            <Input
                                                id="name_hi"
                                                value={formData.name_hi || ''}
                                                onChange={(e) => setFormData({ ...formData, name_hi: e.target.value })}
                                                placeholder="उत्पाद का नाम हिंदी में"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description_hi">Description (Hindi)</Label>
                                            <Textarea
                                                id="description_hi"
                                                value={formData.description_hi || ''}
                                                onChange={(e) => setFormData({ ...formData, description_hi: e.target.value })}
                                                placeholder="हिंदी में विवरण"
                                                rows={4}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="story_hi">Story (Hindi)</Label>
                                            <Textarea
                                                id="story_hi"
                                                value={formData.story_hi || ''}
                                                onChange={(e) => setFormData({ ...formData, story_hi: e.target.value })}
                                                placeholder="हिंदी में कहानी"
                                                rows={3}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="how_to_use_hi">कैसे इस्तेमाल करें (Hindi)</Label>
                                            <Textarea
                                                id="how_to_use_hi"
                                                value={formData.how_to_use_hi || ''}
                                                onChange={(e) => setFormData({ ...formData, how_to_use_hi: e.target.value })}
                                                placeholder="हिंदी में उपयोग की जानकारी"
                                                rows={4}
                                            />
                                        </div>
                                    </TabsContent>
                                    
                                    {/* Gujarati Tab */}
                                    <TabsContent value="gu" className="space-y-4 mt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="category_gu">શ્રેણી (Gujarati)</Label>
                                            <Select
                                                value={formData.category_id || undefined}
                                                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="શ્રેણી પસંદ કરો" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id}>
                                                            {category.name_gu}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="name_gu">Name (Gujarati) <span className="text-destructive">*</span></Label>
                                            <Input
                                                id="name_gu"
                                                value={formData.name_gu || ''}
                                                onChange={(e) => setFormData({ ...formData, name_gu: e.target.value })}
                                                placeholder="ઉત્પાદનનું નામ ગુજરાતીમાં"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description_gu">Description (Gujarati)</Label>
                                            <Textarea
                                                id="description_gu"
                                                value={formData.description_gu || ''}
                                                onChange={(e) => setFormData({ ...formData, description_gu: e.target.value })}
                                                placeholder="ગુજરાતીમાં વર્ણન"
                                                rows={4}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="story_gu">Story (Gujarati)</Label>
                                            <Textarea
                                                id="story_gu"
                                                value={formData.story_gu || ''}
                                                onChange={(e) => setFormData({ ...formData, story_gu: e.target.value })}
                                                placeholder="ગુજરાતીમાં વાર્તા"
                                                rows={3}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="how_to_use_gu">કેમ વાપરશો (Gujarati)</Label>
                                            <Textarea
                                                id="how_to_use_gu"
                                                value={formData.how_to_use_gu || ''}
                                                onChange={(e) => setFormData({ ...formData, how_to_use_gu: e.target.value })}
                                                placeholder="ગુજરાતીમાં વાપરવાની માહિતી"
                                                rows={4}
                                            />
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Product
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Products;
