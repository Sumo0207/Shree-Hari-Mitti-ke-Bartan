import { useState, useEffect } from 'react';
import { Users, Heart, Sparkles, Upload } from "lucide-react";
import artisanImage from "@/assets/artisan-work.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageTransition } from "@/components/PageTransition";
import { useAdmin } from "@/hooks/useAdmin";
import { useImageUpload } from "@/hooks/useImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const About = () => {
  const { t, language, getLocalizedContent } = useLanguage();
  const { isAdmin } = useAdmin();
  const { uploadImage, uploading } = useImageUpload();
  const { toast } = useToast();
  const [showReplaceDialog, setShowReplaceDialog] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [selectedSectionKey, setSelectedSectionKey] = useState<string | null>(null);
  const [dynamicImage, setDynamicImage] = useState<string | null>(null);
  const [aboutSections, setAboutSections] = useState<any[]>([]);

  useEffect(() => {
    fetchAboutContent();
  }, [language]);

  const fetchAboutContent = async () => {
    const { data } = await supabase
      .from('about_content')
      .select('*');

    if (data) {
      setAboutSections(data);
      const mainStory = data.find(s => s.section_key === 'main_story');
      if (mainStory?.image_url) {
        setDynamicImage(mainStory.image_url);
      }
    }
  };

  const getSection = (key: string) => aboutSections.find(s => s.section_key === key);

  const handleImageClick = (imageUrl: string, sectionKey: string) => {
    if (isAdmin) {
      setSelectedImageUrl(imageUrl);
      setSelectedSectionKey(sectionKey);
      setShowReplaceDialog(true);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSectionKey) return;

    const uploadedUrl = await uploadImage(file);
    if (uploadedUrl) {
      const { error } = await supabase
        .from('about_content')
        .upsert({
          section_key: selectedSectionKey,
          image_url: uploadedUrl,
        }, {
          onConflict: 'section_key'
        });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update image.",
        });
      } else {
        toast({
          title: "Success",
          description: "Image replaced successfully.",
        });
        setShowReplaceDialog(false);
        fetchAboutContent();
      }
    }
  };

  const mainImage = dynamicImage || artisanImage;

  return (
    <PageTransition>
      <div className="min-h-screen py-12">
        {/* Header */}
        <section className="container mx-auto px-4 mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-clay-dark mb-6 animate-fade-in">
            {getLocalizedContent(getSection('hero'), 'title') || t("about.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {getLocalizedContent(getSection('hero'), 'content') || t("about.subtitle")}
          </p>
        </section>

        {/* Main Story */}
        <section className="container mx-auto px-4 mb-12 md:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-4 md:space-y-6 animate-fade-in-up order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-clay-dark">
                {getLocalizedContent(getSection('main_story'), 'title') || t("about.mainTitle")}
              </h2>
              <div className="space-y-3 md:space-y-4">
                {getLocalizedContent(getSection('main_story'), 'content') ? (
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {getLocalizedContent(getSection('main_story'), 'content')}
                  </p>
                ) : (
                  <>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                      {t("about.para1")}
                    </p>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                      {t("about.para2")}
                    </p>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                      {t("about.para3")}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div
              className="rounded-2xl overflow-hidden shadow-2xl animate-scale-in relative group order-1 md:order-2"
              onClick={() => isAdmin && handleImageClick(mainImage, 'main_story')}
            >
              <img
                src={mainImage}
                alt="Artisan working on pottery"
                className={`w-full h-auto ${isAdmin ? 'pointer-events-none' : ''}`}
              />
              {isAdmin && (
                <div
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  onClick={() => handleImageClick(mainImage, 'main_story')}
                  aria-label="Replace image"
                  role="button"
                >
                  <Button variant="secondary" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Replace Image
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-12 md:py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 text-clay-dark animate-fade-in">
              {getLocalizedContent(getSection('values'), 'title') || t("about.valuesTitle")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
              <div className="bg-card p-6 md:p-8 rounded-xl shadow-lg text-center animate-fade-in-up hover:shadow-xl transition-all hover:-translate-y-1" style={{ animationDelay: '0.1s' }}>
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <Heart className="text-primary" size={24} />
                </div>
                <h3 className="text-lg md:text-2xl font-semibold mb-2 md:mb-4 text-clay-dark">
                  {getLocalizedContent(getSection('value_love'), 'title') || t("about.loveTitle")}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {getLocalizedContent(getSection('value_love'), 'content') || t("about.loveDesc")}
                </p>
              </div>

              <div className="bg-card p-6 md:p-8 rounded-xl shadow-lg text-center animate-fade-in-up hover:shadow-xl transition-all hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="text-primary" size={24} />
                </div>
                <h3 className="text-lg md:text-2xl font-semibold mb-2 md:mb-4 text-clay-dark">
                  {getLocalizedContent(getSection('value_community'), 'title') || t("about.communityTitle")}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {getLocalizedContent(getSection('value_community'), 'content') || t("about.communityDesc")}
                </p>
              </div>

              <div className="bg-card p-6 md:p-8 rounded-xl shadow-lg text-center animate-fade-in-up hover:shadow-xl transition-all hover:-translate-y-1" style={{ animationDelay: '0.3s' }}>
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <Sparkles className="text-primary" size={24} />
                </div>
                <h3 className="text-lg md:text-2xl font-semibold mb-2 md:mb-4 text-clay-dark">
                  {getLocalizedContent(getSection('value_natural'), 'title') || t("about.naturalTitle")}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {getLocalizedContent(getSection('value_natural'), 'content') || t("about.naturalDesc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Process */}
        <section className="py-12 md:py-20 container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 text-clay-dark animate-fade-in">
            {getLocalizedContent(getSection('process'), 'title') || t("about.processTitle")}
          </h2>
          <div className="max-w-4xl mx-auto space-y-4 md:space-y-8">
            <div className="bg-card p-4 md:p-8 rounded-xl shadow-lg border-l-4 border-primary animate-fade-in-up hover:shadow-xl transition-shadow" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 text-primary">1. {getLocalizedContent(getSection('step_1'), 'title') || t("about.step1")}</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {getLocalizedContent(getSection('step_1'), 'content') || t("about.step1Desc")}
              </p>
            </div>

            <div className="bg-card p-4 md:p-8 rounded-xl shadow-lg border-l-4 border-primary animate-fade-in-up hover:shadow-xl transition-shadow" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 text-primary">2. {getLocalizedContent(getSection('step_2'), 'title') || t("about.step2")}</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {getLocalizedContent(getSection('step_2'), 'content') || t("about.step2Desc")}
              </p>
            </div>

            <div className="bg-card p-4 md:p-8 rounded-xl shadow-lg border-l-4 border-primary animate-fade-in-up hover:shadow-xl transition-shadow" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 text-primary">3. {getLocalizedContent(getSection('step_3'), 'title') || t("about.step3")}</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {getLocalizedContent(getSection('step_3'), 'content') || t("about.step3Desc")}
              </p>
            </div>

            <div className="bg-card p-4 md:p-8 rounded-xl shadow-lg border-l-4 border-primary animate-fade-in-up hover:shadow-xl transition-shadow" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 text-primary">4. {getLocalizedContent(getSection('step_4'), 'title') || t("about.step4")}</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {getLocalizedContent(getSection('step_4'), 'content') || t("about.step4Desc")}
              </p>
            </div>
          </div>
        </section>

        {/* Quote */}
        <section className="py-16 bg-gradient-to-r from-primary to-terracotta-glow text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <blockquote className="text-2xl md:text-4xl font-serif italic max-w-4xl mx-auto mb-6">
              {getLocalizedContent(getSection('quote'), 'content') || t("about.quote")}
            </blockquote>
            <p className="text-lg opacity-90">- {getLocalizedContent(getSection('quote'), 'title') || t("about.quoteAuthor")}</p>
          </div>
        </section>
      </div>

      <Dialog open={showReplaceDialog} onOpenChange={setShowReplaceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <img
                src={selectedImageUrl || ''}
                alt="Current"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            </div>
            <div>
              <Input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default About;
