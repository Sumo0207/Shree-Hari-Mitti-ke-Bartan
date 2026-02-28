import { useState, useEffect } from "react";
import { Leaf, Heart, Flame, Sparkles, ArrowRight, CheckCircle2, Users, Thermometer } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import heroImage from "@/assets/hero-pottery.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageTransition } from "@/components/PageTransition";
import PotteryWheelAnimation from "@/components/PotteryWheelAnimation";
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from "@tanstack/react-query";
import { TestimonialsForm } from "@/components/TestimonialsForm";

const TestimonialsList = ({ onEmpty }: { onEmpty?: (isEmpty: boolean) => void }) => {
  const { language, getLocalizedContent } = useLanguage();

  const { data: testimonials } = useQuery({
    queryKey: ['testimonials-home', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Strict localization filter
      const filtered = (data || []).filter(item => !!getLocalizedContent(item, 'message')).slice(0, 10);

      if (onEmpty) {
        onEmpty(filtered.length === 0);
      }

      return filtered;
    }
  });

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className="space-y-4">
      {testimonials.map((item) => (
        <div key={item.id} className="bg-card p-6 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-semibold text-clay-dark">{getLocalizedContent(item, 'customer_name')}</div>
              {item.customer_location && (
                <div className="text-sm text-muted-foreground">{item.customer_location}</div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
            </div>
          </div>
          <p className="text-lg text-clay-dark mb-3">{getLocalizedContent(item, 'message')}</p>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < (item.rating || 0) ? 'text-primary' : 'text-muted'}>★</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const Home = () => {
  const { t, language, getLocalizedContent } = useLanguage();
  const [testimonialsEmpty, setTestimonialsEmpty] = useState(false);
  const { scrollY } = useScroll();

  // Parallax transforms for different layers
  const heroImageY = useTransform(scrollY, [0, 500], [0, 150]);
  const particlesY = useTransform(scrollY, [0, 500], [0, -100]);
  const orbsY = useTransform(scrollY, [0, 500], [0, -50]);
  const textY = useTransform(scrollY, [0, 300], [0, 50]);
  const wheelY = useTransform(scrollY, [0, 500], [0, -80]);

  const { data: categories } = useQuery({
    queryKey: ['home-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name_en');
      if (error) throw error;

      // Strict localization filter
      return (data || []).filter(cat => !!getLocalizedContent(cat, 'name'));
    }
  });

  const [aboutImage, setAboutImage] = useState<string | null>(null);
  const [aboutSections, setAboutSections] = useState<any[]>([]);

  useEffect(() => {
    const fetchAboutContent = async () => {
      const { data } = await supabase
        .from('about_content')
        .select('*');

      if (data) {
        setAboutSections(data);
        const mainStory = data.find(s => s.section_key === 'main_story');
        if (mainStory?.image_url) {
          setAboutImage(mainStory.image_url);
        }
      }
    };
    fetchAboutContent();
  }, [language]);

  const getSection = (key: string) => aboutSections.find(s => s.section_key === key);

  const { data: featuredProducts } = useQuery({
    queryKey: ['home-featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('visible', true);
      if (error) throw error;

      // Strict localization filter
      return (data || []).filter(p => !!getLocalizedContent(p, 'name')).slice(0, 4);
    }
  });

  const craftSteps = [
    { icon: Sparkles, step: getLocalizedContent(getSection('step_1'), 'title') || t("home.craftStep1") },
    { icon: Users, step: getLocalizedContent(getSection('step_2'), 'title') || t("home.craftStep2") },
    { icon: Thermometer, step: getLocalizedContent(getSection('step_3'), 'title') || t("home.craftStep3") },
    { icon: Heart, step: getLocalizedContent(getSection('step_4'), 'title') || t("home.craftStep4") },
  ];

  const whyPoints = [
    t("home.whyPoint1"),
    t("home.whyPoint2"),
    t("home.whyPoint3"),
    t("home.whyPoint4"),
  ];

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-screen overflow-hidden">
          {/* Animated background particles with parallax */}
          <motion.div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ y: orbsY }}
          >
            <div className="absolute w-96 h-96 bg-terracotta/20 rounded-full blur-3xl animate-pulse top-1/4 -left-48" style={{ animationDuration: '4s' }} />
            <div className="absolute w-80 h-80 bg-clay/30 rounded-full blur-3xl animate-pulse bottom-1/4 right-0" style={{ animationDuration: '5s', animationDelay: '1s' }} />
            <div className="absolute w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse top-1/2 left-1/3" style={{ animationDuration: '6s', animationDelay: '2s' }} />

            {/* Pottery Wheel with Pot Being Shaped */}
            <motion.div style={{ y: wheelY }}>
              <PotteryWheelAnimation />
            </motion.div>
          </motion.div>

          <div className="absolute inset-0">
            <motion.img
              src={heroImage}
              alt="Potter shaping clay on wheel"
              className="w-full h-full object-cover animate-slow-zoom"
              style={{ y: heroImageY, scale: 1.1 }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-clay-dark/90 via-clay-dark/70 to-clay-dark/40" />

            {/* Floating dust particles effect with parallax */}
            <motion.div className="absolute inset-0" style={{ y: particlesY }}>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-primary-foreground/20 rounded-full animate-bounce"
                  style={{
                    left: `${15 + i * 15}%`,
                    top: `${20 + (i % 3) * 25}%`,
                    animationDuration: `${3 + i * 0.5}s`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </motion.div>
          </div>

          <motion.div
            className="relative container mx-auto px-4 h-full flex items-center"
            style={{ y: textY }}
          >
            <div className="max-w-2xl text-primary-foreground space-y-8 animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block">{t('home.brand.line1')}</span>
                <span className="block text-3xl md:text-4xl lg:text-5xl font-semibold mt-2">{t('home.brand.line2')}</span>
              </h1>

              <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                {getLocalizedContent(getSection('hero'), 'content') || t("home.heroTagline")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg"
                >
                  <span>{t("home.exploreCollection")}</span>
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center space-x-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30 px-8 py-4 rounded-lg font-semibold text-lg transition-all backdrop-blur-sm"
                >
                  <span>{t("home.ourStory")}</span>
                </Link>
              </div>
            </div>
          </motion.div>


        </section>

        {/* Featured Products Section */}
        {featuredProducts && featuredProducts.length > 0 && (
          <section className="py-24 bg-clay-light/30">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-clay-dark">
                Featured Collection
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product) => (
                  <Link key={product.id} to={`/products?id=${product.id}`} className="group block">
                    <div className="bg-card rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform group-hover:-translate-y-2">
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={getLocalizedContent(product, 'name')}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-clay-dark mb-2">{getLocalizedContent(product, 'name')}</h3>
                        <p className="text-primary font-medium">Coming Soon</p>
                        {/* You might want to format price here if available */}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-12">
                <Link
                  to="/products"
                  className="inline-flex items-center space-x-2 text-primary font-semibold hover:text-primary/80 transition-colors"
                >
                  <span>View All Products</span>
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* About Section */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-clay-dark mb-6">
                {getLocalizedContent(getSection('main_story'), 'title') || t("home.aboutTitle")}
              </h2>
              <div className="space-y-4 mb-8">
                {getLocalizedContent(getSection('main_story'), 'content') ? (
                  <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {getLocalizedContent(getSection('main_story'), 'content')}
                  </p>
                ) : (
                  <>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {t("home.aboutPara1")}
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {t("home.aboutPara2")}
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {t("home.aboutPara3")}
                    </p>
                  </>
                )}
              </div>

              <Link
                to="/about"
                className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 font-semibold text-lg transition-colors group"
              >
                <span>{t("home.ourStory")}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Craft Process Section */}
        <section className="py-24 container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-clay-dark">
            {t("home.craftTitle")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {craftSteps.map((item, index) => (
              <div
                key={index}
                className="relative bg-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <item.icon className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-clay-dark">
                  {item.step}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-24 bg-clay-light/50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-clay-dark">
              {t("home.productsTitle")}
            </h2>

            {categories && categories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.id}`}
                    className="bg-card p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-2 border border-border hover:border-primary/50 animate-fade-in"
                  >
                    <h3 className="text-lg font-semibold text-clay-dark group-hover:text-primary transition-colors">
                      {getLocalizedContent(category, 'name')}
                    </h3>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <p>No categories found. Please add some in the admin panel.</p>
              </div>
            )}

            <div className="text-center mt-12">
              <Link
                to="/products"
                className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg"
              >
                <span>{t("home.exploreCollection")}</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section className="py-24 container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-clay-dark">
            {t("home.whyTitle")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {whyPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="text-accent" size={24} />
                </div>
                <p className="text-lg text-clay-dark font-medium">{point}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-24 bg-gradient-to-br from-primary/10 via-secondary/30 to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <blockquote className="text-2xl md:text-4xl font-serif italic max-w-4xl mx-auto mb-6">
              "{getLocalizedContent(getSection('quote'), 'content') || t("home.quoteText")}"
            </blockquote>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-gradient-to-r from-clay-dark/5 to-primary/5">
          <div className="container mx-auto px-4">
            {!testimonialsEmpty && (
              <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-bold text-clay-dark">
                  {t('home.testimonialsTitle') || 'Testimonials'}
                </h2>
              </div>
            )}

            <div className={`grid ${testimonialsEmpty ? 'grid-cols-1' : 'md:grid-cols-2'} gap-8 items-start justify-center`}>
              {!testimonialsEmpty && (
                <div className="space-y-6 max-w-xl mx-auto">
                  <TestimonialsList onEmpty={setTestimonialsEmpty} />
                </div>
              )}

              <div className="max-w-md mx-auto">
                <div className="mb-4 text-center md:text-left">
                  <h3 className="text-xl font-semibold">{t('testimonials.title') || 'Share Your Experience'}</h3>
                  <p className="text-sm text-muted-foreground">{t('testimonials.subtitle') || "We'd love to hear about your experience."}</p>
                </div>
                <TestimonialsForm />
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Home;
