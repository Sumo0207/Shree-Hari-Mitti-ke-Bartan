
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const { t, getLocalizedContent } = useLanguage();
  const { settings } = useSettings();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-clay-dark text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Brand Section */}
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-3">
              {settings?.logo_url && (
                <img src={settings.logo_url} alt={getLocalizedContent(settings, 'business_name') || "Logo"} className="h-12 w-12 md:h-16 md:w-16 object-contain" />
              )}
              <h3 className="text-lg md:text-xl font-bold">{getLocalizedContent(settings, 'business_name') || "Shree Hari Mitti ke Bartan"}</h3>
            </div>
            <p className="text-sm opacity-90 italic">
              {t("footer.tagline")}
            </p>
            <p className="text-sm opacity-80">
              {getLocalizedContent(settings, 'footer') || t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-lg font-semibold">{t("footer.quickLinks")}</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link to="/" className="hover:text-terracotta-glow transition-colors w-fit hover:translate-x-1 transform duration-200">
                {t("nav.home")}
              </Link>
              <Link to="/about" className="hover:text-terracotta-glow transition-colors w-fit hover:translate-x-1 transform duration-200">
                {t("nav.about")}
              </Link>
              <Link to="/products" className="hover:text-terracotta-glow transition-colors w-fit hover:translate-x-1 transform duration-200">
                {t("nav.products")}
              </Link>
              <Link to="/gallery" className="hover:text-terracotta-glow transition-colors w-fit hover:translate-x-1 transform duration-200">
                {t("nav.gallery")}
              </Link>
              <Link to="/testimonials" className="hover:text-terracotta-glow transition-colors w-fit hover:translate-x-1 transform duration-200">
                {t("nav.testimonials")}
              </Link>
              <Link to="/guides" className="hover:text-terracotta-glow transition-colors w-fit hover:translate-x-1 transform duration-200">
                {t("nav.guides")}
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          {(() => {
            const hasAddress = !!getLocalizedContent(settings, 'address');
            const hasPhone = !!settings?.phone;
            const hasEmail = !!settings?.email;

            if (!hasAddress && !hasPhone && !hasEmail) return null;

            return (
              <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h4 className="text-lg font-semibold">{t("footer.contactUs")}</h4>
                <div className="space-y-3 text-sm opacity-90">
                  {hasAddress && (
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="mt-1 flex-shrink-0" />
                      <p className="whitespace-pre-wrap">{getLocalizedContent(settings, 'address')}</p>
                    </div>
                  )}
                  {hasPhone && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      <a href={`tel:${settings.phone}`} className="hover:underline">{settings.phone}</a>
                    </div>
                  )}
                  {hasEmail && (
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <a href={`mailto:${settings.email}`} className="hover:underline">{settings.email}</a>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Social Links */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h4 className="text-lg font-semibold">{t("footer.followUs")}</h4>
            <div className="flex gap-4">
              {settings?.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-terracotta-glow transition-all hover:scale-110 transform duration-200">
                  <Facebook size={24} />
                </a>
              )}
              {settings?.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-terracotta-glow transition-all hover:scale-110 transform duration-200">
                  <Instagram size={24} />
                </a>
              )}
              {settings?.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-terracotta-glow transition-all hover:scale-110 transform duration-200">
                  <Youtube size={24} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-primary-foreground/20 text-center text-xs opacity-60">
          <p>
            © {currentYear} {getLocalizedContent(settings, 'business_name') || "Shree Hari Mitti ke Bartan"}. {t("footer.rights")}
          </p>
          <p className="mt-2">
            {t("footer.developer")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
