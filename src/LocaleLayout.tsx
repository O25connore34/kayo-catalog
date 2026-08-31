import { useEffect } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { I18nProvider, translate } from "./i18n";
import { defaultLocale, isLocale } from "./locale";

export function LocaleLayout() {
  const { locale } = useParams();
  if (!isLocale(locale)) {
    return <Navigate to={`/${defaultLocale}`} replace />;
  }

  return (
    <I18nProvider locale={locale}>
      <Shell locale={locale} />
    </I18nProvider>
  );
}

function Shell({ locale }: { locale: "ja" | "en" | "zh" }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = translate(locale, "meta", "title");
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", translate(locale, "meta", "description"));
  }, [locale]);

  return (
    <div className="flex min-h-dvh flex-col antialiased">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
