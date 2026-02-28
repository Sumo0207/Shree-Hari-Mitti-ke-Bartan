import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { PageTransition } from "@/components/PageTransition";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

const Contact = () => {
    const { settings } = useSettings();
    const { toast } = useToast();
    const { t, getLocalizedContent } = useLanguage();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            message: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        try {
            const { error } = await supabase.from("inquiries").insert({
                customer_name: values.name,
                customer_email: values.email,
                customer_phone: values.phone,
                message: values.message,
                status: 'new'
            });

            if (error) throw error;

            toast({
                title: t('contact.successTitle'),
                description: t('contact.successDesc'),
            });
            form.reset();
        } catch (error) {
            console.error("Error sending message:", error);
            toast({
                variant: "destructive",
                title: t('contact.errorTitle'),
                description: t('contact.errorDesc'),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen py-12 bg-background">
                <section className="container mx-auto px-4 mb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-clay-dark mb-6 animate-fade-in">
                        {t('contact.title')}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        {t('contact.subHeader')}
                    </p>
                </section>

                <section className="container mx-auto px-4 max-w-6xl">
                    {(() => {
                        const hasAddress = !!getLocalizedContent(settings, 'address');
                        const hasPhone = !!settings?.phone;
                        const hasEmail = !!settings?.email;
                        const hasHours = !!getLocalizedContent(settings, 'business_hours_days') || !!getLocalizedContent(settings, 'business_hours_closed');
                        const hasContactInfo = hasAddress || hasPhone || hasEmail || hasHours || !!settings?.google_map;

                        return (
                            <div className={`grid grid-cols-1 ${hasContactInfo ? 'lg:grid-cols-2' : 'max-w-2xl mx-auto'} gap-12`}>
                                {/* Contact Information */}
                                {hasContactInfo && (
                                    <div className="space-y-8 animate-fade-in-up">
                                        <div className="bg-card p-8 rounded-2xl shadow-lg border border-border">
                                            <h3 className="text-2xl font-bold text-clay-dark mb-6">{t('contact.getInTouch')}</h3>

                                            <div className="space-y-6">
                                                {hasAddress && (
                                                    <div className="flex items-start gap-4">
                                                        <div className="bg-primary/10 p-3 rounded-full">
                                                            <MapPin className="text-primary h-6 w-6" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-foreground">{t('contact.visitUs')}</h4>
                                                            <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{getLocalizedContent(settings, 'address')}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {hasPhone && (
                                                    <div className="flex items-start gap-4">
                                                        <div className="bg-primary/10 p-3 rounded-full">
                                                            <Phone className="text-primary h-6 w-6" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-foreground">{t('contact.callUs')}</h4>
                                                            <a href={`tel:${settings.phone}`} className="text-muted-foreground mt-1 hover:text-primary transition-colors block">
                                                                {settings.phone}
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}

                                                {hasEmail && (
                                                    <div className="flex items-start gap-4">
                                                        <div className="bg-primary/10 p-3 rounded-full">
                                                            <Mail className="text-primary h-6 w-6" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-foreground">{t('contact.emailUs')}</h4>
                                                            <a href={`mailto:${settings.email}`} className="text-muted-foreground mt-1 hover:text-primary transition-colors block">
                                                                {settings.email}
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}

                                                {hasHours && (
                                                    <div className="flex items-start gap-4">
                                                        <div className="bg-primary/10 p-3 rounded-full">
                                                            <Clock className="text-primary h-6 w-6" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-foreground">{t('contact.businessHours')}</h4>
                                                            <p className="text-muted-foreground mt-1 whitespace-pre-wrap">
                                                                {getLocalizedContent(settings, 'business_hours_days')}<br />
                                                                {getLocalizedContent(settings, 'business_hours_closed')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {settings?.google_map && (
                                                <div className="mt-8 rounded-xl overflow-hidden h-64 border border-border/50">
                                                    <iframe
                                                        src={settings.google_map}
                                                        width="100%"
                                                        height="100%"
                                                        style={{ border: 0 }}
                                                        allowFullScreen
                                                        loading="lazy"
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                        title="Google Map Location"
                                                    ></iframe>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Contact Form */}
                                <div className="bg-card p-8 rounded-2xl shadow-lg border border-border animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                                    <h3 className="text-2xl font-bold text-clay-dark mb-6">{t('contact.sendMessageHeader')}</h3>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t('contact.name')}</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder={t('contact.name')} {...field} autoComplete="name" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className={`grid grid-cols-1 ${hasContactInfo ? 'md:grid-cols-2' : ''} gap-6`}>
                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>{t('contact.email')}</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="your@email.com" {...field} autoComplete="email" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="phone"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>{t('contact.phone')}</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="+91 98765 43210" {...field} autoComplete="tel" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name="message"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t('contact.message')}</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder={t('contact.messagePlaceholder')}
                                                                className="min-h-[150px] resize-none"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                                {isSubmitting ? (
                                                    <span className="flex items-center gap-2">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        {t('contact.sending')}
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2">
                                                        <Send size={18} />
                                                        {t('contact.submit')}
                                                    </span>
                                                )}
                                            </Button>
                                        </form>
                                    </Form>
                                </div>
                            </div>
                        );
                    })()}
                </section>
            </div>
        </PageTransition>
    );
};

export default Contact;
