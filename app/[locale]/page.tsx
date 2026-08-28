import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SearchDesk } from "@/components/SearchDesk";
import { listCities, listHotels, listReviews, listRoutes, listTickets } from "@/lib/queries";
import { duration, loc, tokyoISO, yen } from "@/lib/format";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: locParam } = await params;
  const locale = locParam as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const ht = await getTranslations("hotels");
  const tt = await getTranslations("tickets");
  const rt = await getTranslations("routes");

  const [cities, hotels, tickets, routes, reviews] = await Promise.all([
    listCities(),
    listHotels(),
    listTickets(),
    listRoutes(),
    listReviews(),
  ]);

  const featured = hotels.find((h) => h.slug === "higashiyama-ishi") ?? hotels[0];
  const rest = hotels.filter((h) => h.id !== featured.id).slice(0, 4);

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-stretch gap-0 px-4 pt-6 lg:grid-cols-[1.15fr_0.85fr]">
        <figure className="relative min-h-[320px] overflow-hidden border border-rule lg:min-h-[520px]">
          <Image
            src="/images/hero/hero-kyoto-station.png"
            alt={t("photoCaption")}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 58vw, 100vw"
          />
          <figcaption className="absolute bottom-0 left-0 right-0 bg-ink/75 px-4 py-2 text-xs text-paper-3">
            {t("photoCaption")}
          </figcaption>
        </figure>
        <div className="border border-t-0 border-rule bg-paper-2 p-5 lg:border-t lg:border-l-0">
          <p className="text-xs tracking-[0.28em] text-shu">{t("kicker")}</p>
          <h1 className="display mt-3 text-3xl leading-snug text-ink md:text-4xl">
            {t("headline")}
          </h1>
          <p className="mt-4 text-sm leading-7 text-ink-soft">{t("lead")}</p>
          <p className="mt-3 text-xs text-pine">
            {t("countHotels", { n: hotels.length })} · {t("countTickets", { n: tickets.length })} ·{" "}
            {t("countRoutes", { n: routes.length })}
          </p>
          <div className="mt-5">
            <SearchDesk
              cities={cities}
              locale={locale}
              defaults={{
                checkIn: tokyoISO(14),
                checkOut: tokyoISO(17),
                travelDate: tokyoISO(14),
              }}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="display text-2xl">{t("boardTitle")}</h2>
            <p className="mt-1 text-sm text-ink-soft">{t("boardLead")}</p>
          </div>
          <Link href="/tickets" className="text-sm text-shu underline-offset-4 hover:underline">
            {tt("title")}
          </Link>
        </div>
        <div className="overflow-x-auto border border-rule bg-pine text-paper-3">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs tracking-wider text-ochre">
              <tr>
                <th className="px-3 py-2 font-medium">{t("colService")}</th>
                <th className="px-3 py-2 font-medium">{t("colPath")}</th>
                <th className="px-3 py-2 font-medium">{t("colTime")}</th>
                <th className="px-3 py-2 font-medium">{t("colFrom")}</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="border-t border-white/10">
                  <td className="px-3 py-2">
                    <Link href={`/tickets/${ticket.slug}`} className="hover:text-ochre">
                      {loc(ticket, locale, "name")}
                    </Link>
                  </td>
                  <td className="px-3 py-2 ticket-num">
                    {ticket.firstDeparture}–{ticket.lastDeparture}
                  </td>
                  <td className="px-3 py-2 ticket-num">{duration(ticket.durationMin, locale)}</td>
                  <td className="px-3 py-2 ticket-num">
                    {yen(ticket.priceReservedYen, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="display text-2xl">{t("housesTitle")}</h2>
        <p className="mt-1 mb-6 text-sm text-ink-soft">{t("housesLead")}</p>
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Link href={`/hotels/${featured.slug}`} className="group paper-card overflow-hidden">
            <div className="relative h-72">
              <Image
                src={featured.image}
                alt={loc(featured, locale, "name")}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 55vw, 100vw"
              />
            </div>
            <div className="p-5">
              <p className="text-xs tracking-[0.2em] text-shu">
                {ht(`kind.${featured.kind}`)}
              </p>
              <h3 className="display mt-1 text-2xl group-hover:text-shu">
                {loc(featured, locale, "name")}
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                {loc(featured, locale, "summary")}
              </p>
              <p className="mt-3 text-sm">{ht("fromNight", { price: yen(featured.priceFromYen, locale) })}</p>
            </div>
          </Link>
          <div className="flex flex-col gap-3">
            {rest.map((hotel) => (
              <Link
                key={hotel.id}
                href={`/hotels/${hotel.slug}`}
                className="grid grid-cols-[112px_1fr] overflow-hidden border border-rule bg-paper-3 hover:border-shu"
              >
                <div className="relative h-full min-h-[96px]">
                  <Image
                    src={hotel.image}
                    alt={loc(hotel, locale, "name")}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <div className="p-3">
                  <p className="display text-lg">{loc(hotel, locale, "name")}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-soft">
                    {loc(hotel, locale, "summary")}
                  </p>
                  <p className="mt-2 text-xs ticket-num">
                    {yen(hotel.priceFromYen, locale)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="display text-2xl">{t("routesTitle")}</h2>
        <p className="mt-1 mb-6 text-sm text-ink-soft">{t("routesLead")}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {routes.map((route) => (
            <Link key={route.id} href={`/routes/${route.slug}`} className="paper-card overflow-hidden">
              <div className="relative h-44">
                <Image
                  src={route.image}
                  alt={loc(route, locale, "name")}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-shu">{rt("nights", { n: route.nights })}</p>
                <h3 className="display mt-1 text-xl">{loc(route, locale, "name")}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {loc(route, locale, "summary")}
                </p>
                <p className="mt-3 text-sm">
                  {rt("from", { price: yen(route.priceFromYen, locale) })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-rule bg-paper-2">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="display text-2xl">{t("notesTitle")}</h2>
          <p className="mt-1 mb-6 text-sm text-ink-soft">{t("notesLead")}</p>
          <div className="grid gap-6 md:grid-cols-2">
            {reviews.map((review) => (
              <blockquote
                key={review.id}
                className="grid grid-cols-[64px_1fr] gap-4 border-l-2 border-shu pl-4"
              >
                <Image
                  src={review.avatar}
                  alt={loc(review, locale, "author")}
                  width={64}
                  height={64}
                  className="h-16 w-16 object-cover"
                />
                <div>
                  <p className="text-sm leading-7">{loc(review, locale, "body")}</p>
                  <footer className="mt-2 text-xs text-ink-soft">
                    {loc(review, locale, "author")} · {loc(review, locale, "from")} · {review.stayMonth}
                  </footer>
                </div>
              </blockquote>
            ))}
          </div>
          <Link
            href="/desk"
            className="mt-8 inline-block border border-pine px-4 py-2 text-sm text-pine hover:bg-pine hover:text-paper-3"
          >
            {t("deskCta")}
          </Link>
        </div>
      </section>
    </div>
  );
}
