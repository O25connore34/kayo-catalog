import { createContext, useContext, useMemo, type ReactNode } from "react";
import ja from "../messages/ja.json";
import en from "../messages/en.json";
import zh from "../messages/zh.json";
import type { Locale } from "./locale";

const catalogs = { ja, en, zh } as const;

type Vars = Record<string, string | number>;
type Translate = (key: string, vars?: Vars) => string;

function lookup(obj: unknown, path: string): string | undefined {
  let cur: unknown = obj;
  for (const part of path.split(".")) {
    if (!cur || typeof cur !== "object" || !(part in cur)) return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return typeof cur === "string" ? cur : undefined;
}

function interpolate(template: string, vars?: Vars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    vars[name] === undefined ? `{${name}}` : String(vars[name]),
  );
}

export function translate(locale: Locale, ns: string, key: string, vars?: Vars) {
  const path = `${ns}.${key}`;
  const text = lookup(catalogs[locale], path) ?? lookup(catalogs.ja, path) ?? path;
  return interpolate(text, vars);
}

type I18nValue = {
  locale: Locale;
  t: (ns: string) => Translate;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const value = useMemo<I18nValue>(
    () => ({
      locale,
      t: (ns: string) => (key, vars) => translate(locale, ns, key, vars),
    }),
    [locale],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("I18nProvider missing");
  return ctx;
}

export function useLocale() {
  return useI18n().locale;
}

export function useT(ns: string): Translate {
  return useI18n().t(ns);
}
