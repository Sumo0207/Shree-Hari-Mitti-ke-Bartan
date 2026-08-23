import { useLanguage } from "@/contexts/LanguageContext";

const languageLabels = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिन्दी" },
  { code: "gu", label: "ગુજરાતી" },
];

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 text-sm font-medium flex-shrink-0">
      {languageLabels.map((lang, index) => (
        <span key={lang.code} className="flex items-center">
          <button
            onClick={() => setLanguage(lang.code as any)}
            className={`px-1 py-0.5 rounded transition-colors ${
              language === lang.code
                ? "text-primary font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {lang.label}
          </button>
          {index < languageLabels.length - 1 && (
            <span className="text-muted-foreground mx-0.5">|</span>
          )}
        </span>
      ))}
    </div>
  );
};
