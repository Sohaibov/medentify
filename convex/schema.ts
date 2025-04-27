import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  pills: defineTable({
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
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
