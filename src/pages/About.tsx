import React from "react";
import { useTranslation } from "react-i18next";

export function About() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  return (
    <div className="flex flex-col items-center justify-center w-full h-full py-12">
      <div className="max-w-2xl bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-3xl font-bold text-[#0C2D48] mb-4">Medentify</h2>
        <p className="text-[#333333] text-lg mb-4">
          {isArabic
            ? "Medentify هي منصة رقمية تم تطويرها لمساعدة المرضى والعاملين في القطاع الصحي على التعرف بدقة على الأدوية من خلال خصائصها الفيزيائية مثل رمز النقش، اللون، الشكل، وعدد الشقوق. وتعتمد المنصة على قاعدة بيانات منظمة، وتتميز بواجهة استخدام سهلة تتيح الوصول السريع والدقيق للمعلومات الدوائية، مما يساهم في تقليل أخطاء تناول الأدوية وتعزيز كفاءة التعرف على الحبوب في البيئات السريرية والاستخدام الشخصي."
            : "Medentify is a digital platform developed to help patients and healthcare professionals accurately identify medications based on physical characteristics such as imprint code, color, shape, and scoring. With a user-friendly interface and a structured database, the tool aims to reduce medication errors and improve the efficiency of drug identification in both clinical and personal settings."}
        </p>
        <ul className="text-[#333333] text-lg mx-auto max-w-md mb-4" style={{ direction: isArabic ? "rtl" : "ltr" }}>
          <li>
            {isArabic
              ? "• قاعدة بيانات شاملة للأدوية الشائعة"
              : "• Comprehensive database of common medications"}
          </li>
          <li>
            {isArabic
              ? "• واجهة سهلة الاستخدام ومتوافقة مع الجوال"
              : "• User-friendly, mobile-compatible interface"}
          </li>
          <li>
            {isArabic
              ? "• دعم للبحث باللغتين العربية والإنجليزية"
              : "• Support for both Arabic and English search"}
          </li>
        </ul>
        <p className="text-[#7A2E2E] font-semibold">
          {isArabic
            ? "Medentify - دليلك الذكي للتعرف على الحبوب"
            : "Medentify - Your smart pill identification guide"}
        </p>
      {/* Survey box */}
        <a
          href="https://forms.gle/QSJUXvhmX1mYnEmD6"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full max-w-xs mx-auto mt-6 p-4 rounded-lg shadow bg-[#E6F2FA] border border-[#1C75BC] text-[#0C2D48] font-semibold text-center hover:bg-[#1C75BC] hover:text-white transition"
          style={{ direction: isArabic ? "rtl" : "ltr" }}
        >
          {isArabic ? "شارك في تقييم المنصة" : "Take our evaluation survey"}
        </a>
      </div>
    </div>
  );
}