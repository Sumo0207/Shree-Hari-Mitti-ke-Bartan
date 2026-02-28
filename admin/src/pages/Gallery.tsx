import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import ImageUpload from "@/components/ui/image-upload";

type GalleryImage = Database['public']['Tables']['gallery_images']['Row'];

const Gallery = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
    const [captions, setCaptions] = useState({
        en: "",
        hi: "",
        gu: ""
    });
    const [activeTab, setActiveTab] = useState<'en' | 'hi' | 'gu'>("en");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const { data, error } = await supabase
                .from('gallery_images')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setImages(data || []);
        } catch (error) {
            console.error('Error fetching gallery:', error);
            toast.error("Failed to load gallery images");
        } finally {
            setLoading(false);
        }
    };

    const handleAddImage = async () => {
        if (!newImageUrl) {
            toast.error("Please upload an image");
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('gallery_images')
                .insert([{
                    image_url: newImageUrl,
                    caption: captions.en,
                    caption_en: captions.en,
                    caption_hi: captions.hi,
                    caption_gu: captions.gu
                }]);

            if (error) throw error;
            toast.success("Image added to gallery");
            setIsDialogOpen(false);
            setNewImageUrl(null);
            setCaptions({ en: "", hi: "", gu: "" });
            fetchImages();
        } catch (error: any) {
            console.error('Error adding image:', error);
            toast.error(error.message || "Failed to add image");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this image?")) return;

        try {
            // Should verify if we need to delete from storage as well, but usually handled separately or by trigger.
            // For now, just delete the record using the ID. 
            // NOTE: Deleting from storage requires parsing the URL or knowing the path. 

            const { error } = await supabase
                .from('gallery_images')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success("Image deleted successfully");
            fetchImages();
        } catch (error: any) {
            console.error('Error deleting image:', error);
            toast.error(error.message || "Failed to delete image");
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
                    <h2 className="text-3xl font-bold tracking-tight">Gallery</h2>
                    <p className="text-muted-foreground">
                        Manage your gallery images
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
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Image
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground border rounded-md border-dashed">
                        No images in gallery.
                    </div>
                ) : (
                    images.map((image) => (
                        <Card key={image.id} className="overflow-hidden group">
                            <CardContent className="p-0 relative aspect-square">
                                <img
                                    src={image.image_url}
                                    alt={(image as any)[`caption_${activeTab}`] || image.caption || "Gallery image"}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDelete(image.id)}
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Gallery Image</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <ImageUpload
                            value={newImageUrl}
                            onChange={setNewImageUrl}
                            bucket="gallery"
                            label="Gallery Image"
                        />
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium border-b pb-2">Localized Caption ({activeTab.toUpperCase()})</h3>
                            <div className="space-y-2">
                                <Label htmlFor={`caption_${activeTab}`}>Caption ({activeTab.toUpperCase()})</Label>
                                <Input
                                    id={`caption_${activeTab}`}
                                    value={captions[activeTab]}
                                    onChange={(e) => setCaptions({ ...captions, [activeTab]: e.target.value })}
                                    placeholder={`Caption in ${activeTab.toUpperCase()}`}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddImage} disabled={submitting || !newImageUrl}>
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Image
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Gallery;
