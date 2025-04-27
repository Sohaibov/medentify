import React, { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useTranslation } from "react-i18next";

// Color palette (fixed order, English and Arabic)
const COLOR_PALETTE = [
  { en: "WHITE", ar: "أبيض" },
  { en: "BLACK", ar: "أسود" },
  { en: "BROWN", ar: "بني" },
  { en: "GREEN", ar: "أخضر" },
  { en: "RED", ar: "أحمر" },
  { en: "YELLOW", ar: "أصفر" },
  { en: "LIGHT YELLOW", ar: "أصفر فاتح" },
  { en: "BLUE", ar: "أزرق" },
  { en: "LIGHT BLUE", ar: "أزرق فاتح" },
  { en: "ORANGE", ar: "برتقالي" },
  { en: "PINK", ar: "وردي" },
  { en: "PALE PINK", ar: "وردي فاتح" },
  { en: "PEACH", ar: "خوخي" },
  { en: "PURPLE", ar: "أرجواني" },
  { en: "GRAY", ar: "رمادي" },
];

// Shape palette (English and Arabic, with icons)
const SHAPE_PALETTE = [
  { en: "ROUND", ar: "دائري", icon: "round" },
  { en: "OVAL", ar: "بيضاوي", icon: "oval" },
  { en: "OBLONG", ar: "مستطيل", icon: "oblong" },
  { en: "TRIANGLE", ar: "مثلث", icon: "triangle" },
  { en: "SQUARE", ar: "مربع", icon: "square" },
  { en: "DIAMOND", ar: "معيَّن", icon: "diamond" },
  { en: "TEAR", ar: "شكل الدمعة", icon: "tear" },
  { en: "5 SIDED", ar: "خماسي", icon: "pentagon" },
  { en: "OTHER", ar: "أخرى" },
];

// Scoring palette (English and Arabic, with icons)
const SCORING_PALETTE = [
  { en: "NONE", ar: "لا يوجد", icon: "none" },
  { en: "SINGLE", ar: "خط واحد", icon: "single" },
  { en: "MULTIPLE", ar: "أكثر من خط", icon: "multiple" },
];

// SVG icons for shapes
const shapeIcons: Record<string, React.ReactElement> = {
  round: (
    <svg width="20" height="20" viewBox="0 0 20 20" className="inline align-middle">
      <circle cx="10" cy="10" r="8" fill="#fff" stroke="#0C2D48" strokeWidth="2"/>
    </svg>
  ),
  oval: (
    <svg width="28" height="20" viewBox="0 0 28 20" className="inline align-middle">
      <ellipse cx="14" cy="10" rx="12" ry="8" fill="#fff" stroke="#0C2D48" strokeWidth="2"/>
    </svg>
  ),
  oblong: (
    <svg width="32" height="16" viewBox="0 0 32 16" className="inline align-middle">
      <rect x="4" y="4" width="24" height="8" rx="4" fill="#fff" stroke="#0C2D48" strokeWidth="2"/>
    </svg>
  ),
  triangle: (
    <svg width="22" height="20" viewBox="0 0 22 20" className="inline align-middle">
      <polygon points="11,3 20,17 2,17" fill="#fff" stroke="#0C2D48" strokeWidth="2"/>
    </svg>
  ),
  square: (
    <svg width="20" height="20" viewBox="0 0 20 20" className="inline align-middle">
      <rect x="4" y="4" width="12" height="12" fill="#fff" stroke="#0C2D48" strokeWidth="2"/>
    </svg>
  ),
  diamond: (
    <svg width="20" height="20" viewBox="0 0 20 20" className="inline align-middle">
      <polygon points="10,2 18,10 10,18 2,10" fill="#fff" stroke="#0C2D48" strokeWidth="2"/>
    </svg>
  ),
  tear: (
    <svg width="22" height="22" viewBox="0 0 22 22" className="inline align-middle">
      <path
        d="M11 3 Q17 10, 11 19 Q5 10, 11 3 Z"
        fill="#fff"
        stroke="#0C2D48"
        strokeWidth="2"
      />
    </svg>
  ),
  pentagon: (
    <svg width="22" height="22" viewBox="0 0 22 22" className="inline align-middle">
      <polygon
        points="11,3 20,9 16,19 6,19 2,9"
        fill="#fff"
        stroke="#0C2D48"
        strokeWidth="2"
      />
    </svg>
  ),
};

// SVG icons for scoring
const scoringIcons: Record<string, React.ReactElement> = {
  none: (
    <svg width="20" height="20" viewBox="0 0 20 20" className="inline align-middle">
      <circle cx="10" cy="10" r="8" fill="#fff" stroke="#0C2D48" strokeWidth="2"/>
    </svg>
  ),
  single: (
    <svg width="20" height="20" viewBox="0 0 20 20" className="inline align-middle">
      <circle cx="10" cy="10" r="8" fill="#fff" stroke="#0C2D48" strokeWidth="2"/>
      <line x1="4" y1="10" x2="16" y2="10" stroke="#0C2D48" strokeWidth="2"/>
    </svg>
  ),
  multiple: (
    <svg width="20" height="20" viewBox="0 0 20 20" className="inline align-middle">
      <circle cx="10" cy="10" r="8" fill="#fff" stroke="#0C2D48" strokeWidth="2"/>
      <line x1="4" y1="10" x2="16" y2="10" stroke="#0C2D48" strokeWidth="2"/>
      <line x1="10" y1="4" x2="10" y2="16" stroke="#0C2D48" strokeWidth="2"/>
    </svg>
  ),
};

function getShapeIcon(shape: string, lang: "en" | "ar") {
  const palette = SHAPE_PALETTE.find(
    s => (lang === "ar" ? s.ar : s.en).trim() === shape.trim()
  );
  return palette && palette.icon ? shapeIcons[palette.icon as keyof typeof shapeIcons] : null;
}
function getScoringIcon(scoring: string, lang: "en" | "ar") {
  const palette = SCORING_PALETTE.find(
    s => (lang === "ar" ? s.ar : s.en).trim() === scoring.trim()
  );
  return palette && palette.icon ? scoringIcons[palette.icon as keyof typeof scoringIcons] : null;
}

export function Search() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const dir = isArabic ? "rtl" : "ltr";
  const textAlign = isArabic ? "text-right" : "text-left";

  // --- Filters from backend, language-aware ---
  const filters = useQuery(api.pills.getFilters, { lang: isArabic ? "ar" : "en" }) ?? {
    color1s: [],
    color2s: [],
    color3s: [],
    shapes: [],
    dosageForms: [],
    scorings: [],
  };

  // --- Identify Unknown Pill mode state ---
  const [imprint, setImprint] = useState("");
  const [color1, setColor1] = useState("");
  const [color2, setColor2] = useState("");
  const [color3, setColor3] = useState("");
  const [shape, setShape] = useState("");
  const [dosageForm, setDosageForm] = useState("");
  const [scoring, setScoring] = useState("");

  // --- Results for Identify Unknown Pill mode (language-aware) ---
  const resultsRaw = useQuery(api.pills.search, {
    imprint,
    color1,
    color2,
    color3,
    shape,
    dosageForm,
    scoring,
    lang: isArabic ? "ar" : "en",
  }) ?? [];

  // Sort results alphabetically by brand name (A-Z, case-insensitive, language-aware)
  const results = useMemo(() => {
    return [...resultsRaw].sort((a, b) =>
      ((isArabic ? a.brandNameAr : a.brandName) || "").localeCompare(
        (isArabic ? b.brandNameAr : b.brandName) || "",
        undefined,
        { sensitivity: "base" }
      )
    );
  }, [resultsRaw, isArabic]);

  // --- Clear all filters ---
  function handleClearFilters() {
    setImprint("");
    setColor1("");
    setColor2("");
    setColor3("");
    setShape("");
    setDosageForm("");
    setScoring("");
  }

  // --- Get all color/shape/scoring options in the current language ---
  const colorOptions = COLOR_PALETTE.map(c => isArabic ? c.ar : c.en);
  const shapeOptions = SHAPE_PALETTE.filter(s => s.en !== "CAPSULE" && s.ar !== "كبسولة").map(s => isArabic ? s.ar : s.en);
  const scoringOptions = [SCORING_PALETTE[0], SCORING_PALETTE[1], SCORING_PALETTE[2]].map(s => isArabic ? s.ar : s.en);

  return (
    <div dir={dir} className="w-full max-w-2xl mx-auto bg-[#FAF9F7] rounded-lg shadow p-6 flex flex-col items-center">
      <h2 className={`text-2xl font-bold text-[#0C2D48] mb-2 text-center`}>{t("search.heading")}</h2>
      <p className={`text-[#333333] mb-4 text-center`}>{t("search.description")}</p>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 w-full"
        onSubmit={e => e.preventDefault()}
      >
        <div>
          <label className={`block text-[#0C2D48] font-semibold mb-1 ${textAlign}`}>{t("search.imprint")}</label>
          <input
            type="text"
            value={imprint}
            onChange={e => setImprint(e.target.value)}
            className={`w-full border rounded p-2 ${textAlign}`}
            placeholder={t("search.imprint")}
            dir={dir}
          />
        </div>
        <div>
          <label className={`block text-[#0C2D48] font-semibold mb-1 ${textAlign}`}>{t("search.color1")}</label>
          <select
            value={color1}
            onChange={e => setColor1(e.target.value)}
            className={`w-full border rounded p-2 ${textAlign}`}
          >
            <option value="">{t("search.any")}</option>
            {colorOptions.map((color) => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={`block text-[#0C2D48] font-semibold mb-1 ${textAlign}`}>{t("search.color2")}</label>
          <select
            value={color2}
            onChange={e => setColor2(e.target.value)}
            className={`w-full border rounded p-2 ${textAlign}`}
          >
            <option value="">{t("search.any")}</option>
            {colorOptions.map((color) => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={`block text-[#0C2D48] font-semibold mb-1 ${textAlign}`}>{t("search.color3")}</label>
          <select
            value={color3}
            onChange={e => setColor3(e.target.value)}
            className={`w-full border rounded p-2 ${textAlign}`}
          >
            <option value="">{t("search.any")}</option>
            {colorOptions.map((color) => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={`block text-[#0C2D48] font-semibold mb-1 ${textAlign}`}>{t("search.shape")}</label>
          <div className="relative">
            <select
              value={shape}
              onChange={e => setShape(e.target.value)}
              className={`w-full border rounded p-2 pr-8 ${textAlign}`}
              style={{ appearance: "none" }}
            >
              <option value="">{t("search.any")}</option>
              {shapeOptions.map((shapeOpt) => (
                <option key={shapeOpt} value={shapeOpt}>
                  {shapeOpt}
                </option>
              ))}
            </select>
            {/* Show icon for selected shape */}
            {shape && getShapeIcon(shape, isArabic ? "ar" : "en") && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                {getShapeIcon(shape, isArabic ? "ar" : "en")}
              </span>
            )}
          </div>
          {/* Visual aid for shapes */}
          <div className="flex flex-wrap gap-2 mt-2">
            {shapeOptions.map((shapeOpt) => (
              <span
                key={shapeOpt}
                className={`flex items-center gap-1 px-2 py-1 rounded border text-xs ${
                  shape === shapeOpt
                    ? "bg-[#E6F2FA] border-[#1C75BC] text-[#0C2D48] font-bold"
                    : "bg-white border-gray-300 text-[#333333]"
                } cursor-pointer`}
                onClick={() => setShape(shapeOpt)}
                style={{ minWidth: 70 }}
              >
                {getShapeIcon(shapeOpt, isArabic ? "ar" : "en")}
                {shapeOpt}
              </span>
            ))}
          </div>
        </div>
        <div>
          <label className={`block text-[#0C2D48] font-semibold mb-1 ${textAlign}`}>{t("search.dosageForm")}</label>
          <select
            value={dosageForm}
            onChange={e => setDosageForm(e.target.value)}
            className={`w-full border rounded p-2 ${textAlign}`}
          >
            <option value="">{t("search.any")}</option>
            {filters.dosageForms.map((form: string) => (
              <option key={form} value={form}>{form}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={`block text-[#0C2D48] font-semibold mb-1 ${textAlign}`}>{t("search.scoring")}</label>
          <div className="relative">
            <select
              value={scoring}
              onChange={e => setScoring(e.target.value)}
              className={`w-full border rounded p-2 pr-8 ${textAlign}`}
              style={{ appearance: "none" }}
            >
              <option value="">{t("search.any")}</option>
              {scoringOptions.map((scoringOpt) => (
                <option key={scoringOpt} value={scoringOpt}>
                  {scoringOpt}
                </option>
              ))}
            </select>
            {/* Show icon for selected scoring */}
            {scoring && getScoringIcon(scoring, isArabic ? "ar" : "en") && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                {getScoringIcon(scoring, isArabic ? "ar" : "en")}
              </span>
            )}
          </div>
          {/* Visual aid for scoring */}
          <div className="flex flex-wrap gap-2 mt-2">
            {scoringOptions.map((scoringOpt) => (
              <span
                key={scoringOpt}
                className={`flex items-center gap-1 px-2 py-1 rounded border text-xs ${
                  scoring === scoringOpt
                    ? "bg-[#E6F2FA] border-[#1C75BC] text-[#0C2D48] font-bold"
                    : "bg-white border-gray-300 text-[#333333]"
                } cursor-pointer`}
                onClick={() => setScoring(scoringOpt)}
                style={{ minWidth: 70 }}
              >
                {getScoringIcon(scoringOpt, isArabic ? "ar" : "en")}
                {scoringOpt}
              </span>
            ))}
          </div>
        </div>
      </form>
      {/* Clear Filters Button */}
      <button
        type="button"
        onClick={handleClearFilters}
        className="mb-6 px-6 py-2 rounded font-semibold bg-[#E6F2FA] text-[#0C2D48] border border-[#1C75BC] hover:bg-[#1C75BC] hover:text-white transition"
        style={{ alignSelf: isArabic ? "flex-end" : "flex-start" }}
      >
        {t("search.clearFilters", "Clear Filters")}
      </button>
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-2 text-[#0C2D48] text-center">{t("search.results")}</h3>
        {results.length === 0 ? (
          <div className="text-[#333333] text-center">{t("search.noResults")}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((pill: any) => (
              <div key={pill._id} className={`border rounded-lg p-4 flex flex-col bg-[#7A2E2E]/10 ${isArabic ? "text-right" : ""}`} dir={dir}>
                <div className="flex-1">
                  <div className={`font-bold text-[#0C2D48] text-lg mb-1 ${textAlign}`}>
                    {isArabic ? pill.brandNameAr : pill.brandName}
                  </div>
                  <div className={`text-[#333333] text-sm mb-1 ${textAlign}`}>
                    {isArabic ? pill.genericNameAr : pill.genericName}
                  </div>
                  <div className={`text-xs text-[#333333] mb-1 ${textAlign}`}>
                    <b>{t("search.imprint")}:</b> {isArabic ? pill.imprintCodeAr : pill.imprintCode}
                  </div>
                  <div className={`text-xs text-[#333333] mb-1 ${textAlign}`}>
                    <b>{t("search.strength")}:</b> {isArabic ? pill.strengthAr : pill.strength}
                  </div>
                  <div className={`text-xs text-[#333333] mb-1 ${textAlign}`}>
                    <b>{t("search.dosageForm")}:</b> {isArabic ? pill.dosageFormAr : pill.dosageForm}
                  </div>
                  <div className={`text-xs text-[#333333] mb-1 ${textAlign}`}>
                    <b>{t("search.color1")}:</b> {isArabic ? pill.color1Ar : pill.color1}
                  </div>
                  {pill.color2 && (
                    <div className={`text-xs text-[#333333] mb-1 ${textAlign}`}>
                      <b>{t("search.color2")}:</b> {isArabic ? pill.color2Ar : pill.color2}
                    </div>
                  )}
                  {pill.color3 && (
                    <div className={`text-xs text-[#333333] mb-1 ${textAlign}`}>
                      <b>{t("search.color3")}:</b> {isArabic ? pill.color3Ar : pill.color3}
                    </div>
                  )}
                  <div className={`text-xs text-[#333333] mb-1 flex items-center gap-1 ${textAlign}`}>
                    <b>{t("search.shape")}:</b> {getShapeIcon(isArabic ? pill.shapeAr : pill.shape, isArabic ? "ar" : "en")} {isArabic ? pill.shapeAr : pill.shape}
                  </div>
                  <div className={`text-xs text-[#333333] mb-1 flex items-center gap-1 ${textAlign}`}>
                    <b>{t("search.scoring")}:</b> {getScoringIcon(isArabic ? pill.scoringAr : pill.scoring, isArabic ? "ar" : "en")} {isArabic ? pill.scoringAr : pill.scoring}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
