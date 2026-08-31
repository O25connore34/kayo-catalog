import { Navigate, useParams } from "react-router-dom";
import { asset } from "../asset";
import { cities, getRoute, listReviews } from "../catalog";
import { BookingForm } from "../components/BookingForm";
import { LocaleLink } from "../components/LocaleLink";
import { loc, tokyoISO, yen } from "../format";
import { useLocale, useT } from "../i18n";
import { localePath } from "../locale-path";

export function RouteDetailPage() {
  const locale = useLocale();
  const { slug = "" } = useParams();
  const route = getRoute(slug);
  const t = useT("routes");

  if (!route) {
    return <Navigate to={localePath(locale, "/")} replace />;
  }

  const reviews = listReviews("route", route.id);
  const stops = route.stops.split(",").map((id) => {
    const c = cities.find((x) => x.id === id);
    return c ? loc(c, locale, "name") : id;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <LocaleLink to="/routes" className="text-sm text-shu">
        ← {t("back")}
      </LocaleLink>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="relative h-72 border border-rule">
            <img
              src={asset(route.image)}
              alt={loc(route, locale, "name")}
              width={1600}
              height={900}
              className="absolute inset-0 h-full w-full object-cover"
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
              <img
                src={asset(review.avatar)}
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
