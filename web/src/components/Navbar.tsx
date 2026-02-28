import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogIn, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import logo from "@/assets/logo.png?url";

import { useSettings } from "@/contexts/SettingsContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, getLocalizedContent } = useLanguage();
  const { settings } = useSettings();

  const links = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.about"), path: "/about" },
    { name: t("nav.products"), path: "/products" },
    { name: t("nav.gallery"), path: "/gallery" },
    { name: t("nav.guides"), path: "/guides" },
    { name: t("nav.testimonials"), path: "/testimonials" },
    { name: t("nav.contact"), path: "/contact" }
  ];

  const isActive = (path: string) => location.pathname === path;
  const canGoBack = location.pathname !== '/';

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-2 md:px-4 py-2 md:py-1">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <img src={logo} alt={getLocalizedContent(settings, 'business_name') || "Shree Hari Mitti ke Bartan"} className="h-10 w-10 md:h-14 lg:h-16 md:w-14 lg:w-16 object-contain" />
            <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-primary line-clamp-2 md:line-clamp-1">
              {getLocalizedContent(settings, 'business_name') || "Shree Hari Mitti ke Bartan"}
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {canGoBack && (
              <Button variant="ghost" size="sm" onClick={handleBack} className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t("nav.back")}
              </Button>
            )}
            {links.map(link => (
              <Link key={link.path} to={link.path} className={`text-base xl:text-lg transition-colors relative group whitespace-nowrap ${isActive(link.path) ? "text-primary font-semibold" : "text-foreground hover:text-primary"}`}>
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${isActive(link.path) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </Link>
            ))}

            <LanguageSelector />

            {/* Auth Buttons - Desktop */}
            {user ? (
              <ProfileDropdown />
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                <LogIn className="h-4 w-4 mr-2" />
                {t("nav.login")}
              </Button>
            )}
          </div>

          {/* Tablet Menu - Show limited items */}
          <div className="hidden md:flex lg:hidden items-center gap-2">
            <LanguageSelector />
            {user ? (
              <ProfileDropdown />
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                <LogIn className="h-4 w-4" />
              </Button>
            )}
            <button className="text-foreground p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu & Profile Button */}
          <div className="flex items-center gap-2 md:hidden">
            {user && <ProfileDropdown />}
            <button className="text-foreground p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Menu */}
        {isOpen && (
          <div className="lg:hidden mt-2 pb-4 space-y-2 animate-fade-in">
            {canGoBack && (
              <Button variant="ghost" size="sm" onClick={() => { handleBack(); setIsOpen(false); }} className="w-full justify-start">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("nav.back")}
              </Button>
            )}
            {links.map((link, index) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsOpen(false)} 
                className={`block text-base py-2 px-2 rounded-md transition-all hover:bg-primary/10 ${isActive(link.path) ? "text-primary font-semibold bg-primary/5" : "text-foreground"}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {link.name}
              </Link>
            ))}

            {/* Auth Buttons - Mobile */}
            <div className="pt-3 border-t border-clay/30 flex flex-col gap-2 md:hidden">
              <LanguageSelector />
              {!user && (
                <Button variant="outline" onClick={() => {
                  navigate('/auth');
                  setIsOpen(false);
                }}>
                  <LogIn className="h-4 w-4 mr-2" />
                  {t("nav.login")}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar;