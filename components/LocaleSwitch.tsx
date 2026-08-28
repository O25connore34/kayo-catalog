"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

const labels: Record<Locale, string> = {
  ja: "日本語",
  en: "EN",
  zh: "中文",
};

export function LocaleSwitch() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-stretch border border-rule-strong bg-paper-3">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => router.replace(pathname, { locale: l })}
          className={`px-2.5 py-1 text-xs tracking-wide ${
            l === locale
              ? "bg-shu text-paper-3"
              : "text-ink-soft hover:bg-paper-2"
          }`}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
