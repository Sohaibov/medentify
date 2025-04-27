import React from "react";
import { useTranslation } from "react-i18next";
import { HeaderLogo } from "./HeaderLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navLinks = [
    { path: "/", label: t("nav.home", "Home") },
    { path: "/search", label: t("nav.search", "Search") },
    { path: "/about", label: t("nav.about", "About") },
  ];
  return (
    <header
      className="w-full flex items-center justify-between px-4 py-3 bg-[#E6F2FA] border-b border-[#1C75BC] mb-6"
      style={{ direction: isArabic ? "rtl" : "ltr" }}
    >
      <div className="flex items-center gap-4">
        <HeaderLogo />
      </div>
      <nav className="flex gap-6">
        {navLinks.map(link => (
          <button
            key={link.path}
            className="text-[#0C2D48] font-semibold hover:text-[#1C75BC] transition"
            onClick={() => onNavigate(link.path)}
            style={{ fontFamily: "inherit" }}
          >
            {link.label}
          </button>
        ))}
      </nav>
      <div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
