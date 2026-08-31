import { useSearchParams } from "react-router-dom";
import { asset } from "../asset";
import { listRoutes } from "../catalog";
import { LocaleLink } from "../components/LocaleLink";
import { loc, yen } from "../format";
import { useLocale, useT } from "../i18n";

export function RoutesPage() {
  const locale = useLocale();
  const t = useT("routes");
  const [params] = useSearchParams();
  const nightsRaw = params.get("nights");
  const nights = nightsRaw ? Number(nightsRaw) : undefined;
  const routes = listRoutes(Number.isFinite(nights) ? nights : undefined);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs tracking-[0.25em] text-shu">{t("title")}</p>
      <h1 className="display mt-2 text-4xl">{t("title")}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-soft">{t("lead")}</p>
      {routes.length === 0 ? (
        <p className="mt-10 text-sm text-shu">{t("empty")}</p>
      ) : (
        <ul className="mt-8 grid gap-6">
          {routes.map((route) => (
            <li key={route.id}>
              <LocaleLink
                to={`/routes/${route.slug}`}
                className="paper-card grid overflow-hidden md:grid-cols-[280px_1fr]"
              >
                <div className="relative min-h-[180px]">
                  <img
                    src={asset(route.image)}
                    alt={loc(route, locale, "name")}
                    width={560}
                    height={360}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs text-shu">{t("nights", { n: route.nights })}</p>
                  <h2 className="display mt-1 text-2xl">{loc(route, locale, "name")}</h2>
                  <p className="mt-2 text-sm leading-7 text-ink-soft">{loc(route, locale, "summary")}</p>
                  <p className="mt-3 text-sm">{t("from", { price: yen(route.priceFromYen, locale) })}</p>
                </div>
              </LocaleLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
