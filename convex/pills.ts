import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all unique filter options (for dropdowns)
export const getFilters = query({
  args: { lang: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const pills = await ctx.db.query("pills").collect();
    const isArabic = args.lang === "ar";
    const unique = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));
    return {
      color1s: unique(pills.map((p: any) => isArabic ? p.color1Ar : p.color1)),
      color2s: unique(pills.map((p: any) => isArabic ? p.color2Ar : p.color2)),
      color3s: unique(pills.map((p: any) => isArabic ? p.color3Ar : p.color3)),
      shapes: unique(pills.map((p: any) => isArabic ? p.shapeAr : p.shape)),
      dosageForms: unique(pills.map((p: any) => isArabic ? p.dosageFormAr : p.dosageForm)),
      scorings: unique(pills.map((p: any) => isArabic ? p.scoringAr : p.scoring)),
    };
  },
});

// Search pills with all filters (AND logic, orderless color matching, language-aware)
export const search = query({
  args: {
    imprint: v.string(),
    color1: v.string(),
    color2: v.string(),
    color3: v.string(),
    shape: v.string(),
    dosageForm: v.string(),
    scoring: v.string(),
    lang: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const pills = await ctx.db.query("pills").collect();
    const isArabic = args.lang === "ar";

    function colorsMatch(pill: any, args: any) {
      const pillColors = [
        isArabic ? pill.color1Ar : pill.color1,
        isArabic ? pill.color2Ar : pill.color2,
        isArabic ? pill.color3Ar : pill.color3,
      ].filter(Boolean).map((c: string) => c.toUpperCase()).sort();
      const filterColors = [args.color1, args.color2, args.color3].filter(Boolean).map((c: string) => c.toUpperCase()).sort();
      if (filterColors.length === 0) return true;
      return (
        pillColors.length === filterColors.length &&
        pillColors.every((c: string, i: number) => c === filterColors[i])
      );
    }

    return pills.filter((pill: any) => {
      // Imprint: flexible, ignore spaces/case, partial match, language-aware
      if (args.imprint) {
        const norm = (s: string) => (s || "").replace(/\s+/g, "").toLowerCase();
        if (
          !norm(isArabic ? pill.imprintCodeAr : pill.imprintCode).includes(norm(args.imprint))
        ) {
          return false;
        }
      }
      if (!colorsMatch(pill, args)) return false;
      if (args.shape && (isArabic ? pill.shapeAr : pill.shape) !== args.shape) return false;
      if (args.dosageForm && (isArabic ? pill.dosageFormAr : pill.dosageForm) !== args.dosageForm) return false;
      if (args.scoring && (isArabic ? pill.scoringAr : pill.scoring) !== args.scoring) return false;
      return true;
    });
  },
});

// Get all available brand/generic names (for autocomplete dropdown)
export const getAllNames = query({
  args: { lang: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const pills = await ctx.db.query("pills").collect();
    const isArabic = args.lang === "ar";
    const unique = (arr: string[]) => Array.from(new Set(arr));
    return {
      brandNames: unique(
        pills
          .map(p => isArabic ? p.brandNameAr : p.brandName)
          .filter((x): x is string => !!x)
      ),
      genericNames: unique(
        pills
          .map(p => isArabic ? p.genericNameAr : p.genericName)
          .filter((x): x is string => !!x)
      ),
    };
  },
});

// Search pills by brand or generic name (language-aware, both fields optional)
export const searchByName = query({
  args: {
    brandName: v.optional(v.string()),
    genericName: v.optional(v.string()),
    lang: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const pills = await ctx.db.query("pills").collect();
    const isArabic = args.lang === "ar";
    const norm = (s: string) => (s || "").replace(/\s+/g, "").toLowerCase();

    if (!args.brandName && !args.genericName) return [];

    return pills.filter(pill => {
      const brand: string = (isArabic ? pill.brandNameAr : pill.brandName) || "";
      const generic: string = (isArabic ? pill.genericNameAr : pill.genericName) || "";
      const brandMatch = args.brandName ? norm(brand).includes(norm(args.brandName)) : true;
      const genericMatch = args.genericName ? norm(generic).includes(norm(args.genericName)) : true;
      if (args.brandName && args.genericName) {
        return brandMatch && genericMatch;
      }
      return brandMatch && genericMatch;
    });
  },
});

// Import pills from a JSON array
export const importPillsFromJson = mutation({
  args: {
    pills: v.array(
      v.object({
        imprintCode: v.string(),
        imprintCodeAr: v.optional(v.string()),
        genericName: v.string(),
        genericNameAr: v.optional(v.string()),
        brandName: v.string(),
        brandNameAr: v.optional(v.string()),
        strength: v.string(),
        strengthAr: v.optional(v.string()),
        dosageForm: v.string(),
        dosageFormAr: v.optional(v.string()),
        color1: v.string(),
        color1Ar: v.optional(v.string()),
        color2: v.string(),
        color2Ar: v.optional(v.string()),
        color3: v.string(),
        color3Ar: v.optional(v.string()),
        shape: v.string(),
        shapeAr: v.optional(v.string()),
        scoring: v.string(),
        scoringAr: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const pill of args.pills) {
      await ctx.db.insert("pills", pill);
    }
    return { count: args.pills.length };
  },
});
