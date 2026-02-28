import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const TestimonialsForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_location: "",
    message: "",
    rating: 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: t("auth.loginRequired") || "Login Required",
        description: t("auth.loginToAddTestimonial") || "Please login to add a testimonial",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("testimonials").insert({
        customer_name: formData.customer_name,
        customer_location: formData.customer_location,
        message: formData.message,
        rating: formData.rating,
        user_id: user.id,
        is_active: false, // Requires admin approval
      });

      if (error) throw error;

      toast({
        title: t("testimonials.success") || "Testimonial Submitted",
        description: t("testimonials.successDesc") || "Your testimonial has been submitted and is pending approval.",
      });

      setFormData({
        customer_name: "",
        customer_location: "",
        message: "",
        rating: 5,
      });
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      toast({
        title: t("common.error") || "Error",
        description: t("testimonials.error") || "Failed to submit testimonial",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8 bg-card rounded-lg border border-border">
        <p className="text-muted-foreground mb-4">
          {t("auth.loginToAddTestimonial") || "Please login to share your experience"}
        </p>
        <Button asChild>
          <a href="/auth">{t("auth.login") || "Login"}</a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg shadow-lg border border-border">
      <div className="space-y-2">
        <Label htmlFor="customer_name">{t("testimonials.name") || "Your Name"}</Label>
        <Input
          id="customer_name"
          value={formData.customer_name}
          onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
          required
          placeholder={t("testimonials.namePlaceholder") || "Enter your name"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="customer_location">{t("testimonials.location") || "Location (Optional)"}</Label>
        <Input
          id="customer_location"
          value={formData.customer_location}
          onChange={(e) => setFormData({ ...formData, customer_location: e.target.value })}
          placeholder={t("testimonials.locationPlaceholder") || "City, Country"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t("testimonials.message") || "Your Experience"}</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          rows={4}
          placeholder={t("testimonials.messagePlaceholder") || "Share your experience with our products..."}
        />
      </div>

      <div className="space-y-2">
        <Label>{t("testimonials.rating") || "Rating"}</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({ ...formData, rating: star })}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={32}
                className={star <= formData.rating ? "fill-primary text-primary" : "text-muted"}
              />
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? t("common.submitting") || "Submitting..." : t("testimonials.submit") || "Submit Testimonial"}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        {t("testimonials.pendingNote") || "Your testimonial will be reviewed by our team before being published."}
      </p>
    </form>
  );
};
