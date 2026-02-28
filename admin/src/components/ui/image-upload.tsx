import { useState, useId } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
    value: string | null;
    onChange: (url: string | null) => void;
    bucket?: string;
    label?: string;
}

const ImageUpload = ({ value, onChange, bucket = 'products', label = 'Image' }: ImageUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const inputId = useId();

    // Determine accepted file types based on bucket
    const getAcceptedTypes = () => {
        if (bucket === 'settings') return "image/*,.svg";
        return "image/*";
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
            onChange(data.publicUrl);
            toast.success('Image uploaded successfully');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        onChange(null);
    };

    return (
        <div className="space-y-4 w-full">
            <Label htmlFor={inputId}>{label}</Label>
            {value ? (
                <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden border bg-muted">
                    <img
                        src={value}
                        alt="Product"
                        className="object-cover w-full h-full"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemove}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    <Input
                        id={inputId}
                        type="file"
                        accept={getAcceptedTypes()}
                        onChange={handleUpload}
                        disabled={uploading}
                        className="cursor-pointer"
                    />
                    {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
