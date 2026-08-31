import { useLocation, useNavigate } from "react-router-dom";
import { useLocale } from "../i18n";
import { locales, type Locale } from "../locale";

const labels: Record<Locale, string> = {
  ja: "日本語",
  en: "EN",
  zh: "中文",
};

export function LocaleSwitch() {
  const locale = useLocale();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  function switchTo(next: Locale) {
    const parts = pathname.split("/");
    parts[1] = next;
    navigate(`${parts.join("/")}${search}`);
  }

  return (
    <div className="flex items-stretch border border-rule-strong bg-paper-3">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
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
