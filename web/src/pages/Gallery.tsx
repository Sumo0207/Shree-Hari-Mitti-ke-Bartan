import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageTransition } from "@/components/PageTransition";

interface GalleryImage {
  id: string;
  caption: string | null;
  title: string | null;
  description: string | null;
  image_url: string;
  created_at: string;
}

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, getLocalizedContent } = useLanguage();

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const nextImage = () => {
    if (selectedImage !== null && selectedImage < galleryItems.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setSelectedImage(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  const fetchGalleryImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setGalleryItems((data as any) || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen py-12">
        {/* Header */}
        <section className="container mx-auto px-4 mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-clay-dark mb-6 animate-fade-in">
            {t("gallery.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("gallery.subtitle")}
          </p>
        </section>

        {/* Gallery Grid */}
        <section className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("gallery.loading")}</p>
            </div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("gallery.noImages")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(index)}
                  className="group relative aspect-square overflow-hidden rounded-xl shadow-lg cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img
                    src={item.image_url}
                    alt={getLocalizedContent(item, 'caption') || 'Gallery image'}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-clay-dark/90 via-clay-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6 text-white w-full">
                      {getLocalizedContent(item, 'caption') && (
                        <p className="text-lg font-medium">{getLocalizedContent(item, 'caption')}</p>
                      )}
                    </div>
                  </div>

                  {/* Icon/Number Indicator */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-primary/80 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Lightbox Modal */}
        {selectedImage !== null && galleryItems[selectedImage] && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white hover:text-primary transition-colors z-10 p-2 hover:bg-white/10 rounded-full"
              onClick={() => setSelectedImage(null)}
              aria-label="Close lightbox"
            >
              <X size={32} />
            </button>

            {/* Previous Button */}
            {selectedImage > 0 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-colors z-10 p-3 hover:bg-white/10 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                aria-label="Previous image"
              >
                <ChevronLeft size={40} />
              </button>
            )}

            {/* Next Button */}
            {selectedImage < galleryItems.length - 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-colors z-10 p-3 hover:bg-white/10 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                aria-label="Next image"
              >
                <ChevronRight size={40} />
              </button>
            )}

            {/* Image Counter */}
            <div className="absolute top-4 left-4 text-white bg-black/50 px-4 py-2 rounded-full text-sm">
              {selectedImage + 1} / {galleryItems.length}
            </div>

            {/* Image Container */}
            <div
              className="max-w-6xl w-full bg-card rounded-xl overflow-hidden animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video bg-clay-dark">
                <img
                  src={galleryItems[selectedImage].image_url}
                  alt={getLocalizedContent(galleryItems[selectedImage], 'caption') || 'Gallery image'}
                  className="w-full h-full object-contain"
                />
              </div>
              {getLocalizedContent(galleryItems[selectedImage], 'caption') && (
                <div className="p-6 bg-secondary/20">
                  <p className="text-lg text-muted-foreground">
                    {getLocalizedContent(galleryItems[selectedImage], 'caption')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Gallery;
