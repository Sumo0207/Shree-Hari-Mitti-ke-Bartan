import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageTransition } from "@/components/PageTransition";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { BookOpen, Sparkles, Sprout, ArrowRight } from "lucide-react";

interface Guide {
    id: string;
    title_en: string | null;
    title_hi: string | null;
    title_gu: string | null;
    content_en: string | null;
    content_hi: string | null;
    content_gu: string | null;
    slug: string;
    category: "usage" | "care" | "benefit" | "blog";
    thumbnail_url: string | null;
    created_at: string;
}

const Guides = () => {
    const [guides, setGuides] = useState<Guide[]>([]);
    const [loading, setLoading] = useState(true);
    const { t, language, getLocalizedContent } = useLanguage();

    useEffect(() => {
        fetchGuides();
    }, [language]);

    const fetchGuides = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("guides")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                throw error;
            }

            if (data) {
                // Strictly filter guides based on localized title/content existence
                const localized = (data as unknown as Guide[]).filter(g => !!getLocalizedContent(g, 'title') && !!getLocalizedContent(g, 'content'));
                setGuides(localized);
            }
        } catch (error) {
            console.error("Error fetching guides:", error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "usage":
                return <BookOpen className="h-5 w-5 text-blue-500" />;
            case "care":
                return <Sparkles className="h-5 w-5 text-amber-500" />;
            case "benefit":
                return <Sprout className="h-5 w-5 text-green-500" />;
            default:
                return <BookOpen className="h-5 w-5 text-primary" />;
        }
    };

    const getCategoryLabel = (category: string) => {
        // Try to get translation if available, otherwise capitalize
        const key = `guides.categories.${category}` as any;
        const label = t(key);
        return label === key ? category.charAt(0).toUpperCase() + category.slice(1) : label;
    };

    return (
        <PageTransition>
            <div className="min-h-screen py-12">
                {/* Header */}
                <section className="container mx-auto px-4 mb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-clay-dark mb-6 animate-fade-in">
                        {t('guides.title')}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        {t('guides.subtitle')}
                    </p>
                </section>

                {/* Guides Grid */}
                <section className="container mx-auto px-4">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : guides.length === 0 ? (
                        <div className="text-center py-20 bg-secondary/20 rounded-xl">
                            <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-bold text-clay-dark mb-2">{t('guides.comingSoon.title')}</h3>
                            <p className="text-muted-foreground">{t('guides.comingSoon.description')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {guides.map((guide, index) => (
                                <article
                                    key={guide.id}
                                    className="bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 animate-fade-in-up flex flex-col h-full border border-border"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="h-48 overflow-hidden bg-secondary/30 relative">
                                        {guide.thumbnail_url ? (
                                            <img
                                                src={guide.thumbnail_url}
                                                alt={getLocalizedContent(guide, 'title')}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                {getCategoryIcon(guide.category)}
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-sm">
                                            {getCategoryIcon(guide.category)}
                                            {getCategoryLabel(guide.category)}
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <h2 className="text-2xl font-bold text-clay-dark mb-3 line-clamp-2">
                                            {getLocalizedContent(guide, 'title')}
                                        </h2>
                                        <p className="text-muted-foreground line-clamp-3 mb-6 flex-1">
                                            {getLocalizedContent(guide, 'content').substring(0, 150)}...
                                        </p>

                                        <div className="mt-auto pt-4 border-t border-border/50 flex justify-between items-center">
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(guide.created_at).toLocaleDateString()}
                                            </span>
                                            {/* For now, just a placeholder link or expand - in real app would link to detail page */}
                                            <button className="text-primary font-medium text-sm flex items-center hover:underline">
                                                {t('guides.readMore')} <ArrowRight className="ml-1 h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </PageTransition>
    );
};

export default Guides;
