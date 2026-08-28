import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BookingForm } from "@/components/BookingForm";
import { getRoute, listCities, listReviews } from "@/lib/queries";
import { loc, tokyoISO, yen } from "@/lib/format";
import type { Locale } from "@/i18n/routing";

export default async function RouteDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: locParam, slug } = await params;
  const locale = locParam as Locale;
  setRequestLocale(locale);
  const route = await getRoute(slug);
  if (!route) notFound();
  const t = await getTranslations("routes");
  const [cities, reviews] = await Promise.all([
    listCities(),
    listReviews("route", route.id),
  ]);
  const stops = route.stops.split(",").map((id) => {
    const c = cities.find((x) => x.id === id);
    return c ? loc(c, locale, "name") : id;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/routes" className="text-sm text-shu">
        ← {t("back")}
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="relative h-72 border border-rule">
            <Image
              src={route.image}
              alt={loc(route, locale, "name")}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 60vw, 100vw"
              priority
            />
          </div>
          <p className="mt-6 text-xs tracking-[0.2em] text-shu">{t("nights", { n: route.nights })}</p>
          <h1 className="display mt-2 text-4xl">{loc(route, locale, "name")}</h1>
          <p className="mt-4 text-base leading-8">{loc(route, locale, "body")}</p>
          <p className="mt-6 text-sm">
            <span className="text-ink-soft">{t("stops")}: </span>
            {stops.join(" → ")}
          </p>
          <p className="mt-2 text-sm ticket-num">
            {t("from", { price: yen(route.priceFromYen, locale) })}
          </p>
          {reviews.map((review) => (
            <blockquote key={review.id} className="mt-8 grid grid-cols-[56px_1fr] gap-3">
              <Image
                src={review.avatar}
                alt={loc(review, locale, "author")}
                width={56}
                height={56}
                className="h-14 w-14 object-cover"
              />
              <div>
                <p className="text-sm leading-7">{loc(review, locale, "body")}</p>
                <p className="mt-1 text-xs text-ink-soft">
                  {loc(review, locale, "author")} · {review.stayMonth}
                </p>
              </div>
            </blockquote>
          ))}
        </div>
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <BookingForm
            kind="route"
            itemId={route.id}
            defaultTravel={tokyoISO(21)}
            defaultGuests="2"
          />
        </aside>
      </div>
    </div>
  );
}
