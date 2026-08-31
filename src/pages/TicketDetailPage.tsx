import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { asset } from "../asset";
import { getTicket, listReviews } from "../catalog";
import { BookingForm } from "../components/BookingForm";
import { LocaleLink } from "../components/LocaleLink";
import { duration, loc, tokyoISO, yen } from "../format";
import { useLocale, useT } from "../i18n";
import { localePath } from "../locale-path";

export function TicketDetailPage() {
  const locale = useLocale();
  const { slug = "" } = useParams();
  const [params] = useSearchParams();
  const ticket = getTicket(slug);
  const t = useT("tickets");

  if (!ticket) {
    return <Navigate to={localePath(locale, "/")} replace />;
  }

  const reviews = listReviews("ticket", ticket.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <LocaleLink to="/tickets" className="text-sm text-shu">
        ← {t("back")}
      </LocaleLink>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="relative h-72 border border-rule">
            <img
              src={asset(ticket.image)}
              alt={loc(ticket, locale, "name")}
              width={1600}
              height={900}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <p className="mt-6 text-xs tracking-[0.2em] text-shu">{t(`kind.${ticket.kind}`)}</p>
          <h1 className="display mt-2 text-4xl">{loc(ticket, locale, "name")}</h1>
          <p className="mt-4 text-base leading-8">{loc(ticket, locale, "summary")}</p>
          <dl className="mt-8 grid gap-4 border-t border-rule pt-6 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-ink-soft">{t("operator")}</dt>
              <dd className="mt-1">{loc(ticket, locale, "operator")}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-soft">{t("duration")}</dt>
              <dd className="mt-1 ticket-num">{duration(ticket.durationMin, locale)}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-soft">JST</dt>
              <dd className="mt-1">
                {t("departs", {
                  n: ticket.dailyDepartures,
                  first: ticket.firstDeparture,
                  last: ticket.lastDeparture,
                })}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-soft">{t("reserved")}</dt>
              <dd className="mt-1 ticket-num">{yen(ticket.priceReservedYen, locale)}</dd>
            </div>
          </dl>
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
            kind="ticket"
            itemId={ticket.id}
            defaultTravel={params.get("date") ?? tokyoISO(14)}
            defaultGuests={params.get("pax") ?? "2"}
            hasSeats
          />
        </aside>
      </div>
    </div>
  );
}
