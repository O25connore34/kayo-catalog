import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { listRoutes } from "@/lib/queries";
import { loc, yen } from "@/lib/format";
import type { Locale } from "@/i18n/routing";

export default async function RoutesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ nights?: string }>;
}) {
  const { locale: locParam } = await params;
  const locale = locParam as Locale;
  setRequestLocale(locale);
  const q = await searchParams;
  const nights = q.nights ? Number(q.nights) : undefined;
  const t = await getTranslations("routes");
  const routes = await listRoutes(Number.isFinite(nights) ? nights : undefined);

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
              <Link href={`/routes/${route.slug}`} className="paper-card grid overflow-hidden md:grid-cols-[280px_1fr]">
                <div className="relative min-h-[180px]">
                  <Image
                    src={route.image}
                    alt={loc(route, locale, "name")}
                    fill
                    className="object-cover"
                    sizes="280px"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs text-shu">{t("nights", { n: route.nights })}</p>
                  <h2 className="display mt-1 text-2xl">{loc(route, locale, "name")}</h2>
                  <p className="mt-2 text-sm leading-7 text-ink-soft">{loc(route, locale, "summary")}</p>
                  <p className="mt-3 text-sm">{t("from", { price: yen(route.priceFromYen, locale) })}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
