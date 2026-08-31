export const locales = ["ja", "en", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ja";

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}
