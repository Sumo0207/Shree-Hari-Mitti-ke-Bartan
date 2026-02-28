import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PageTransition } from "@/components/PageTransition";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Check, X, Clock } from "lucide-react";
import { EnquiryForm } from "@/components/EnquiryForm";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { formatCurrency } from "@/lib/utils"; // Assuming utils exists or I'll implement simple formatter

interface Product {
    id: string;
    name: string;
    description: string | null;
    story: string | null;
    image_url: string | null;
    category_id: string | null;
    category?: { name: string };
    is_featured: boolean;
    product_images?: ProductImage[];
    price?: number;
    stock_status?: "in_stock" | "out_of_stock" | "made_to_order";
    size?: string;
    material?: string;
}

interface ProductImage {
    id: string;
    image_url: string;
    display_order: number;
}

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t, getLocalizedContent } = useLanguage();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (id) {
            fetchProduct(id);
        }
    }, [id]);

    const fetchProduct = async (productId: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                category:categories(*)
            `)
            .eq('id', productId)
            .single();

        if (error) {
            console.error("Error fetching product:", error);
            navigate("/products"); // Redirect if not found
        } else {
            setProduct(data as unknown as Product); // Type assertion needed due to complex join
            fetchRelatedProducts(data.category_id, data.id);
        }
        setLoading(false);
    };

    const fetchRelatedProducts = async (categoryId: string | null, currentProductId: string) => {
        if (!categoryId) return;

        const { data } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', categoryId)
            .neq('id', currentProductId)
            .eq('visible', true)
            .limit(4);

        if (data) setRelatedProducts(data as unknown as Product[]);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!product) return null;

    const allImages = [
        ...(product.image_url ? [{ image_url: product.image_url, display_order: -1 }] : []),
        ...(product.product_images || [])
    ].sort((a, b) => a.display_order - b.display_order);

    const getStockStatusParams = (status: string | undefined) => {
        switch (status) {
            case 'in_stock': return { label: 'In Stock', icon: Check, color: 'text-green-600 bg-green-100' };
            case 'out_of_stock': return { label: 'Out of Stock', icon: X, color: 'text-red-600 bg-red-100' };
            case 'made_to_order': return { label: 'Made to Order', icon: Clock, color: 'text-amber-600 bg-amber-100' };
            default: return { label: 'Check Availability', icon: Package, color: 'text-blue-600 bg-blue-100' };
        }
    };

    const stockInfo = getStockStatusParams(product.stock_status);
    const StockIcon = stockInfo.icon;

    return (
        <PageTransition>
            <div className="min-h-screen py-12 container mx-auto px-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-8 hover:bg-transparent hover:text-primary transition-colors p-0"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Products
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 animate-fade-in">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="rounded-2xl overflow-hidden bg-card border border-border shadow-lg aspect-square relative">
                            {allImages.length > 0 ? (
                                <Carousel className="w-full h-full">
                                    <CarouselContent>
                                        {allImages.map((img, idx) => (
                                            <CarouselItem key={idx}>
                                                <img
                                                    src={img.image_url}
                                                    alt={getLocalizedContent(product, 'name')}
                                                    className="w-full h-full object-cover"
                                                />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    {allImages.length > 1 && (
                                        <>
                                            <CarouselPrevious className="left-4" />
                                            <CarouselNext className="right-4" />
                                        </>
                                    )}
                                </Carousel>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-secondary/20">
                                    <Package className="h-24 w-24 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        <div>
                            {product.category && (
                                <span className="text-sm font-medium text-primary mb-2 block">
                                    {getLocalizedContent(product.category, 'name')}
                                </span>
                            )}
                            <h1 className="text-4xl font-bold text-clay-dark mb-4">
                                {getLocalizedContent(product, 'name')}
                            </h1>

                            <div className="flex items-center gap-4 mb-6">
                                {product.price && (
                                    <span className="text-3xl font-bold text-primary">
                                        ₹{product.price}
                                    </span>
                                )}
                                <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${stockInfo.color}`}>
                                    <StockIcon size={14} />
                                    <span>{stockInfo.label}</span>
                                </div>
                            </div>

                            <div className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                                <p>{getLocalizedContent(product, 'description')}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 py-6 border-y border-border">
                            {product.size && (
                                <div>
                                    <h4 className="font-semibold text-clay-dark mb-1">Dimensions</h4>
                                    <p className="text-muted-foreground">{product.size}</p>
                                </div>
                            )}
                            {product.material && (
                                <div>
                                    <h4 className="font-semibold text-clay-dark mb-1">Material</h4>
                                    <p className="text-muted-foreground">{product.material}</p>
                                </div>
                            )}
                        </div>

                        {product.story && (
                            <div className="bg-secondary/30 p-6 rounded-xl space-y-3">
                                <h3 className="font-semibold text-lg text-primary flex items-center gap-2">
                                    <span className="text-2xl">✨</span> The Story
                                </h3>
                                <p className="text-muted-foreground italic leading-relaxed">
                                    "{getLocalizedContent(product, 'story')}"
                                </p>
                            </div>
                        )}

                        <div className="pt-4">
                            <EnquiryForm
                                productName={getLocalizedContent(product, 'name')}
                                productId={product.id}
                                trigger={
                                    <Button size="lg" className="w-full md:w-auto text-lg px-8">
                                        {t("products.enquire") || "Enquire About This Piece"}
                                    </Button>
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="border-t border-border pt-16">
                        <h2 className="text-3xl font-bold text-center mb-10 text-clay-dark">You Might Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((related) => (
                                <Link key={related.id} to={`/products/${related.id}`} className="group block">
                                    <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-border">
                                        <div className="aspect-square relative overflow-hidden">
                                            <img
                                                src={related.image_url || "/placeholder.svg"}
                                                alt={getLocalizedContent(related, 'name')}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-clay-dark truncate">{getLocalizedContent(related, 'name')}</h3>
                                            {related.price && (
                                                <p className="text-primary font-medium mt-1">₹{related.price}</p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </PageTransition>
    );
};

export default ProductDetail;
