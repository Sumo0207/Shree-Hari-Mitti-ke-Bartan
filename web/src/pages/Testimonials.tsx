
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageTransition } from "@/components/PageTransition";
import { TestimonialsForm } from "@/components/TestimonialsForm";
import { Loader2, Star } from "lucide-react";

interface Testimonial {
    id: string;
    customer_name: string;
    customer_location: string | null;
    message: string;
    rating: number | null;
}

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loadingTestimonials, setLoadingTestimonials] = useState(true);
    const { t, getLocalizedContent } = useLanguage();

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const { data, error } = await supabase
                .from('testimonials')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (error) throw error;

            // Filter strictly: only show testimonials with a message in current language
            const localized = (data || []).filter(t => !!getLocalizedContent(t, 'message'));
            setTestimonials(localized);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        } finally {
            setLoadingTestimonials(false);
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen py-12">
                {/* Header */}
                <section className="container mx-auto px-4 mb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-clay-dark mb-6 animate-fade-in">
                        {t("nav.testimonials")}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        {t("gallery.community.title")}
                    </p>
                </section>

                {/* Behind the Scenes */}
                <section className="py-20 bg-secondary/30">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-clay-dark">
                            {t("gallery.behindTheScenes.title")}
                        </h2>
                        <div className="max-w-4xl mx-auto space-y-8">
                            <div className="bg-card p-8 rounded-xl shadow-lg border-l-4 border-primary">
                                <h3 className="text-2xl font-bold mb-4 text-primary">
                                    {t("gallery.behindTheScenes.workshop.title")}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    {t("gallery.behindTheScenes.workshop.para1")}
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    {t("gallery.behindTheScenes.workshop.para2")}
                                </p>
                            </div>

                            <div className="bg-card p-8 rounded-xl shadow-lg border-l-4 border-accent">
                                <h3 className="text-2xl font-bold mb-4 text-accent">
                                    {t("gallery.behindTheScenes.firing.title")}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    {t("gallery.behindTheScenes.firing.para1")}
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    {t("gallery.behindTheScenes.firing.para2")}
                                </p>
                            </div>

                            <div className="bg-card p-8 rounded-xl shadow-lg border-l-4 border-primary">
                                <h3 className="text-2xl font-bold mb-4 text-primary">
                                    {t("gallery.behindTheScenes.quality.title")}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {t("gallery.behindTheScenes.quality.para1")}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stories from Our Community */}
                <section id="testimonials" className="py-20 container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {loadingTestimonials ? (
                            <div className="text-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                            </div>
                        ) : testimonials.length > 0 && (
                            <>
                                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-clay-dark">
                                    {t("home.testimonialsTitle")}
                                </h2>

                                <div className="space-y-6 mb-16">
                                    {testimonials.map((testimonial, idx) => (
                                        <div
                                            key={testimonial.id}
                                            className={`bg-gradient-to-r ${idx % 2 === 0 ? 'from-primary/5 to-secondary/10 border-primary' : 'from-accent/5 to-secondary/10 border-accent'} p-8 rounded-xl border-l-4 animate-fade-in-up`}
                                            style={{ animationDelay: `${idx * 0.15}s` }}
                                        >
                                            <p className="text-lg text-muted-foreground italic mb-4">
                                                "{getLocalizedContent(testimonial, 'message')}"
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <p className={`${idx % 2 === 0 ? 'text-primary' : 'text-accent'} font-semibold`}>
                                                    — {getLocalizedContent(testimonial, 'customer_name')}{testimonial.customer_location ? `, ${testimonial.customer_location}` : ''}
                                                </p>
                                                {testimonial.rating && (
                                                    <div className="flex gap-1">
                                                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                                                            <Star key={i} size={16} className="fill-yellow-500 text-yellow-500" />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Submission Form - Always show or hide if no testimonials at all? User said "if not available ... then not how". I'll keep the form but maybe hide the header if that's what they meant. */}
                        <div className={`${!loadingTestimonials && testimonials.length === 0 ? 'mt-0' : 'mt-20'}`}>
                            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-clay-dark">
                                {t("testimonials.title") || "Share Your Story"}
                            </h2>
                            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                                {t("testimonials.subtitle") || "How has Shree Hari Mitti Ke Bartan been a part of your journey? We'd love to hear from you."}
                            </p>
                            <TestimonialsForm />
                        </div>
                    </div>
                </section>
            </div>
        </PageTransition>
    );
};

export default Testimonials;
