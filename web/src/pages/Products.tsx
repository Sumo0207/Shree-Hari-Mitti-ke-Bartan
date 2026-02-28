import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, X, Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageTransition } from "@/components/PageTransition";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  description: string | null;
  story: string | null;
  name_translations?: Record<string, string>;
  description_translations?: Record<string, string>;
  story_translations?: Record<string, string>;
  image_url: string | null;
  category_id: string | null;
  category?: { name: string };
  display_order: number;
  is_featured: boolean;
  product_images?: ProductImage[];
  price?: number;
  stock_status?: "in_stock" | "out_of_stock" | "made_to_order";
}

interface ProductImage {
  id: string;
  image_url: string;
  display_order: number;
}

interface Category {
  id: string;
  name: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language, getLocalizedContent } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedCategoryId = searchParams.get('category');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [language, selectedCategoryId]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name_en');
    if (data) {
      // Only show categories that have a name in the current language
      const filtered = data.filter(cat => !!getLocalizedContent(cat, 'name'));
      setCategories(filtered);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('visible', true)
      .order('display_order', { ascending: true });

    if (selectedCategoryId) {
      query = query.eq('category_id', selectedCategoryId);
    }

    const { data, error } = await query;

    if (!error && data) {
      // Filter products strictly based on localized name existence
      const localizedProducts = (data as unknown as Product[]).filter(p => !!getLocalizedContent(p, 'name'));
      setProducts(localizedProducts);
    }
    setLoading(false);
  };

  const handleCategorySelect = (categoryId: string | null) => {
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen py-12 bg-background">
        {/* Header */}
        <section className="container mx-auto px-4 mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-clay-dark mb-6 animate-fade-in">
            {t("products.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("products.subtitle")}
          </p>
        </section>

        {/* Category Filter */}
        <section className="container mx-auto px-4 mb-12">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 animate-fade-in">
            <Button
              variant={!selectedCategoryId ? "default" : "outline"}
              onClick={() => handleCategorySelect(null)}
              className="rounded-full"
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategoryId === cat.id ? "default" : "outline"}
                onClick={() => handleCategorySelect(cat.id)}
                className="rounded-full"
              >
                {getLocalizedContent(cat, 'name')}
              </Button>
            ))}
            {selectedCategoryId && (
              <Button
                variant="ghost"
                onClick={() => handleCategorySelect(null)}
                className="rounded-full px-2"
                title="Clear filter"
              >
                <X size={16} />
              </Button>
            )}
          </div>
        </section>

        {/* Products Grid */}
        <section className="container mx-auto px-4 mb-16">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground">No products found in this category.</p>
              {selectedCategoryId && (
                <Button variant="link" onClick={() => handleCategorySelect(null)} className="mt-4">
                  View all products
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <Link
                  to={`/products/${product.id}`}
                  key={product.id}
                  className="group"
                >
                  <div
                    className="bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 animate-fade-in-up border border-border hover:border-primary/50 h-full flex flex-col"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="aspect-[4/3] overflow-hidden relative bg-muted/20">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={getLocalizedContent(product, 'name')}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="text-muted-foreground opacity-50" size={48} />
                        </div>
                      )}
                      {product.stock_status === 'out_of_stock' && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          Sold Out
                        </div>
                      )}
                      {product.is_featured && (
                        <div className="absolute top-2 left-2 bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          Featured
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="text-xl font-bold text-clay-dark group-hover:text-primary transition-colors">
                          {getLocalizedContent(product, 'name')}
                        </h3>
                      </div>

                      {product.category && (
                        <span className="text-xs text-muted-foreground mb-3 block">
                          {getLocalizedContent(product.category, 'name')}
                        </span>
                      )}

                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                        {getLocalizedContent(product, 'description')}
                      </p>

                      <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                        {product.price ? (
                          <span className="text-lg font-bold text-primary">₹{product.price}</span>
                        ) : (
                          <span className="text-sm font-medium text-muted-foreground">Price upon request</span>
                        )}
                        <span className="text-sm font-medium text-primary group-hover:underline">
                          View Details
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Clay Care Tips - Simplified for overview */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-clay-dark mb-6">Traditional Craftsmanship</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Each piece is handcrafted with love and care, using traditional techniques passed down through generations.
            </p>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Products;
