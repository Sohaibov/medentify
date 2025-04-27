import React from "react";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  return (
    <button
      className="px-3 py-1 rounded font-semibold border border-[#0C2D48] text-[#0C2D48] bg-white hover:bg-[#E6F2FA] transition"
      onClick={() => i18n.changeLanguage(isArabic ? "en" : "ar")}
      aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
    >
      {isArabic ? "English" : "العربية"}
    </button>
  );
}
