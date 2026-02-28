import { useEffect, useState } from "react";
import { useLanguage, languages } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export const LanguageModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    // Check if user has already selected a language
    const hasSelectedLanguage = localStorage.getItem('language');
    if (!hasSelectedLanguage) {
      setIsOpen(true);
    }
  }, []);

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode as any);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Globe className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">Welcome / स्वागत</DialogTitle>
          <DialogDescription className="text-center text-base">
            Please select your preferred language
            <br />
            कृपया अपनी पसंदीदा भाषा चुनें
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3 mt-4">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={language === lang.code ? "default" : "outline"}
              className="w-full justify-start text-left h-auto py-3 px-4"
              onClick={() => handleLanguageSelect(lang.code)}
            >
              <div className="flex flex-col items-start w-full">
                <span className="font-semibold text-base">{lang.nativeName}</span>
                <span className="text-xs opacity-70">{lang.name}</span>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
