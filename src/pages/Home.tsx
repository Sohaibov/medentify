import React from "react";
import { useTranslation } from "react-i18next";

export function Home() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const tagline = isArabic
    ? "أداة بسيطة وسهلة الوصول تساعد المرضى ومقدّمي الرعاية الصحية من التعرّف على الحبوب الدوائية غير المعروفة."
    : "A simple and accessible tool for patients and healthcare providers to identify unknown pills";

  return (
    <div className="w-full flex flex-col items-center justify-center mt-12">
      <div className="bg-white rounded-lg shadow p-8 max-w-xl w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[#0C2D48] mb-4 text-center">
          Medentify
        </h1>
        <p className="text-[#0C2D48] text-base font-medium text-center mb-6">
          {tagline}
        </p>
        <a
          href="/search"
          className="bg-[#7A2E2E] hover:bg-[#5a1f1f] text-white font-bold px-8 py-3 rounded text-lg transition"
        >
          {isArabic ? "ابدأ البحث" : "Start"}
        </a>
      </div>
    </div>
  );
}
