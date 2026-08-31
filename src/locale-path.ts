import type { Locale } from "./locale";

export function localePath(locale: Locale, to: string) {
  const [path, qs] = to.split("?");
  const prefixed = path === "/" ? `/${locale}` : `/${locale}${path}`;
  return qs ? `${prefixed}?${qs}` : prefixed;
}

export function formAction(locale: Locale, path: string) {
  return `${import.meta.env.BASE_URL}${locale}${path}`;
}
