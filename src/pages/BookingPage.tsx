import { Navigate, useParams } from "react-router-dom";
import { getBooking } from "../bookings";
import { getHotelById, getRouteById, getTicketById } from "../catalog";
import { loc, yen } from "../format";
import { useLocale, useT } from "../i18n";
import { localePath } from "../locale-path";

export function BookingPage() {
  const locale = useLocale();
  const { id = "" } = useParams();
  const booking = getBooking(id);
  const t = useT("booking");
  const nav = useT("nav");

  if (!booking) {
    return <Navigate to={localePath(locale, "/")} replace />;
  }

  const kindLabel =
    booking.kind === "hotel"
      ? nav("hotels")
      : booking.kind === "ticket"
        ? nav("tickets")
        : nav("routes");

  let title = booking.itemId;
  if (booking.kind === "hotel") {
    const hotel = getHotelById(booking.itemId);
    if (hotel) title = loc(hotel, locale, "name");
  } else if (booking.kind === "ticket") {
    const ticket = getTicketById(booking.itemId);
    if (ticket) title = loc(ticket, locale, "name");
  } else {
    const route = getRouteById(booking.itemId);
    if (route) title = loc(route, locale, "name");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="paper-card p-8">
        <p className="text-xs tracking-[0.25em] text-shu">{t("status")}</p>
        <h1 className="display mt-2 text-3xl">{t("title")}</h1>
        <p className="mt-3 text-sm leading-7 text-ink-soft">{t("lead")}</p>
        <dl className="mt-8 space-y-3 border-t border-dashed border-shu pt-6 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">{t("ref")}</dt>
            <dd className="ticket-num text-lg">{booking.ref}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">{kindLabel}</dt>
            <dd className="text-right">{title}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">{t("total")}</dt>
            <dd className="ticket-num">{yen(booking.totalYen, locale)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">{booking.guestName}</dt>
            <dd>{booking.guests}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
