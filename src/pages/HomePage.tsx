import { asset } from "../asset";
import { cities, hotels, reviews, routes, tickets } from "../catalog";
import { LocaleLink } from "../components/LocaleLink";
import { SearchDesk } from "../components/SearchDesk";
import { duration, loc, tokyoISO, yen } from "../format";
import { useLocale, useT } from "../i18n";

export function HomePage() {
  const locale = useLocale();
  const t = useT("home");
  const ht = useT("hotels");
  const tt = useT("tickets");
  const rt = useT("routes");

  const featured = hotels.find((h) => h.slug === "higashiyama-ishi") ?? hotels[0];
  const rest = hotels.filter((h) => h.id !== featured.id).slice(0, 4);

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-stretch gap-0 px-4 pt-6 lg:grid-cols-[1.15fr_0.85fr]">
        <figure className="relative min-h-[320px] overflow-hidden border border-rule lg:min-h-[520px]">
          <img
            src={asset("/images/hero/hero-kyoto-station.png")}
            alt={t("photoCaption")}
            width={1920}
            height={1080}
            className="absolute inset-0 h-full w-full object-cover"
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
          <LocaleLink to="/tickets" className="text-sm text-shu underline-offset-4 hover:underline">
            {tt("title")}
          </LocaleLink>
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
                    <LocaleLink to={`/tickets/${ticket.slug}`} className="hover:text-ochre">
                      {loc(ticket, locale, "name")}
                    </LocaleLink>
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
          <LocaleLink to={`/hotels/${featured.slug}`} className="group paper-card overflow-hidden">
            <div className="relative h-72">
              <img
                src={asset(featured.image)}
                alt={loc(featured, locale, "name")}
                width={1200}
                height={900}
                className="absolute inset-0 h-full w-full object-cover"
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
          </LocaleLink>
          <div className="flex flex-col gap-3">
            {rest.map((hotel) => (
              <LocaleLink
                key={hotel.id}
                to={`/hotels/${hotel.slug}`}
                className="grid grid-cols-[112px_1fr] overflow-hidden border border-rule bg-paper-3 hover:border-shu"
              >
                <div className="relative h-full min-h-[96px]">
                  <img
                    src={asset(hotel.image)}
                    alt={loc(hotel, locale, "name")}
                    width={224}
                    height={168}
                    className="absolute inset-0 h-full w-full object-cover"
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
              </LocaleLink>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="display text-2xl">{t("routesTitle")}</h2>
        <p className="mt-1 mb-6 text-sm text-ink-soft">{t("routesLead")}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {routes.map((route) => (
            <LocaleLink key={route.id} to={`/routes/${route.slug}`} className="paper-card overflow-hidden">
              <div className="relative h-44">
                <img
                  src={asset(route.image)}
                  alt={loc(route, locale, "name")}
                  width={1200}
                  height={900}
                  className="absolute inset-0 h-full w-full object-cover"
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
            </LocaleLink>
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
                <img
                  src={asset(review.avatar)}
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
          <LocaleLink
            to="/desk"
            className="mt-8 inline-block border border-pine px-4 py-2 text-sm text-pine hover:bg-pine hover:text-paper-3"
          >
            {t("deskCta")}
          </LocaleLink>
        </div>
      </section>
    </div>
  );
}
