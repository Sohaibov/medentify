import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ar from "./locales/ar.json";

// Check localStorage for saved language, default to "en"
const savedLang = typeof window !== "undefined" && localStorage.getItem("lang");
const initialLang = savedLang || "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: initialLang,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

// Listen for language changes and persist to localStorage
i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("lang", lng);
  }
});

export default i18n;
