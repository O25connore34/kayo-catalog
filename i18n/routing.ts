import { defineRouting } from "next-intl/routing";

export const locales = ["ja", "en", "zh"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "ja",
  localePrefix: "always",
});
