import { useSearchParams } from "react-router-dom";
import { cities, listTickets } from "../catalog";
import { LocaleLink } from "../components/LocaleLink";
import { duration, loc, yen } from "../format";
import { useLocale, useT } from "../i18n";

export function TicketsPage() {
  const locale = useLocale();
  const t = useT("tickets");
  const [params] = useSearchParams();
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
  const date = params.get("date") ?? "";
  const pax = params.get("pax") ?? "2";
  const tickets = listTickets(from || undefined, to || undefined);
  const cityName = (id: string) => {
    const c = cities.find((x) => x.id === id);
    return c ? loc(c, locale, "name") : id;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs tracking-[0.25em] text-shu">{t("title")}</p>
      <h1 className="display mt-2 text-4xl">{t("title")}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-soft">{t("lead")}</p>

      <form className="mt-6 flex flex-wrap gap-2" method="get">
        <select name="from" defaultValue={from} className="border border-rule bg-paper-3 px-3 py-2 text-sm">
          <option value="">—</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {loc(c, locale, "name")}
            </option>
          ))}
        </select>
        <select name="to" defaultValue={to} className="border border-rule bg-paper-3 px-3 py-2 text-sm">
          <option value="">—</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {loc(c, locale, "name")}
            </option>
          ))}
        </select>
        <input type="hidden" name="date" value={date} />
        <input type="hidden" name="pax" value={pax} />
        <button type="submit" className="bg-pine px-4 py-2 text-sm text-paper-3">
          →
        </button>
      </form>

      {tickets.length === 0 ? (
        <p className="mt-10 text-sm text-shu">{t("empty")}</p>
      ) : (
        <div className="mt-8 overflow-x-auto border border-rule">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-pine text-xs text-paper-3">
              <tr>
                <th className="px-3 py-2 font-medium">{t("title")}</th>
                <th className="px-3 py-2 font-medium">{t("duration")}</th>
                <th className="px-3 py-2 font-medium">{t("unreserved")}</th>
                <th className="px-3 py-2 font-medium">{t("reserved")}</th>
                <th className="px-3 py-2 font-medium">{t("green")}</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => {
                const qs = new URLSearchParams();
                if (date) qs.set("date", date);
                if (pax) qs.set("pax", pax);
                return (
                  <tr key={ticket.id} className="border-t border-rule bg-paper-3">
                    <td className="px-3 py-3">
                      <LocaleLink
                        to={`/tickets/${ticket.slug}${qs.toString() ? `?${qs}` : ""}`}
                        className="hover:text-shu"
                      >
                        <span className="block text-xs text-shu">{t(`kind.${ticket.kind}`)}</span>
                        <span className="display text-lg">{loc(ticket, locale, "name")}</span>
                        <span className="mt-1 block text-xs text-ink-soft">
                          {cityName(ticket.fromCityId)} → {cityName(ticket.toCityId)}
                        </span>
                      </LocaleLink>
                    </td>
                    <td className="px-3 py-3 ticket-num">{duration(ticket.durationMin, locale)}</td>
                    <td className="px-3 py-3 ticket-num">
                      {ticket.priceUnreservedYen ? yen(ticket.priceUnreservedYen, locale) : t("none")}
                    </td>
                    <td className="px-3 py-3 ticket-num">{yen(ticket.priceReservedYen, locale)}</td>
                    <td className="px-3 py-3 ticket-num">
                      {ticket.priceGreenYen ? yen(ticket.priceGreenYen, locale) : t("none")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
