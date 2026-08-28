import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { listCities, listTickets } from "@/lib/queries";
import { duration, loc, yen } from "@/lib/format";
import type { Locale } from "@/i18n/routing";

export default async function TicketsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ from?: string; to?: string; date?: string; pax?: string }>;
}) {
  const { locale: locParam } = await params;
  const locale = locParam as Locale;
  setRequestLocale(locale);
  const q = await searchParams;
  const t = await getTranslations("tickets");
  const [cities, tickets] = await Promise.all([
    listCities(),
    listTickets(q.from, q.to),
  ]);
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
        <select name="from" defaultValue={q.from ?? ""} className="border border-rule bg-paper-3 px-3 py-2 text-sm">
          <option value="">—</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {loc(c, locale, "name")}
            </option>
          ))}
        </select>
        <select name="to" defaultValue={q.to ?? ""} className="border border-rule bg-paper-3 px-3 py-2 text-sm">
          <option value="">—</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {loc(c, locale, "name")}
            </option>
          ))}
        </select>
        <input type="hidden" name="date" value={q.date ?? ""} />
        <input type="hidden" name="pax" value={q.pax ?? "2"} />
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
                if (q.date) qs.set("date", q.date);
                if (q.pax) qs.set("pax", q.pax);
                return (
                  <tr key={ticket.id} className="border-t border-rule bg-paper-3">
                    <td className="px-3 py-3">
                      <Link href={`/tickets/${ticket.slug}${qs.toString() ? `?${qs}` : ""}`} className="hover:text-shu">
                        <span className="block text-xs text-shu">{t(`kind.${ticket.kind}`)}</span>
                        <span className="display text-lg">{loc(ticket, locale, "name")}</span>
                        <span className="mt-1 block text-xs text-ink-soft">
                          {cityName(ticket.fromCityId)} → {cityName(ticket.toCityId)}
                        </span>
                      </Link>
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
