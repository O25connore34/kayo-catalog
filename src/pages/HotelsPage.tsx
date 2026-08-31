import { useSearchParams } from "react-router-dom";
import { asset } from "../asset";
import { cities, listHotels } from "../catalog";
import { LocaleLink } from "../components/LocaleLink";
import { loc, walk, yen } from "../format";
import { useLocale, useT } from "../i18n";

export function HotelsPage() {
  const locale = useLocale();
  const t = useT("hotels");
  const search = useT("search");
  const [params] = useSearchParams();
  const city = params.get("city") ?? "";
  const checkIn = params.get("checkIn") ?? "";
  const checkOut = params.get("checkOut") ?? "";
  const guests = params.get("guests") ?? "2";
  const hotels = listHotels(city || undefined);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs tracking-[0.25em] text-shu">{t("title")}</p>
      <h1 className="display mt-2 text-4xl">{t("title")}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-soft">{t("lead")}</p>

      <form className="mt-6 flex flex-wrap gap-2" action="" method="get">
        <select
          name="city"
          defaultValue={city}
          className="border border-rule bg-paper-3 px-3 py-2 text-sm"
        >
          <option value="">{search("anyCity")}</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {loc(c, locale, "name")}
            </option>
          ))}
        </select>
        <input type="hidden" name="checkIn" value={checkIn} />
        <input type="hidden" name="checkOut" value={checkOut} />
        <input type="hidden" name="guests" value={guests} />
        <button type="submit" className="bg-pine px-4 py-2 text-sm text-paper-3">
          →
        </button>
      </form>

      {hotels.length === 0 ? (
        <p className="mt-10 text-sm text-shu">{t("empty")}</p>
      ) : (
        <ul className="mt-8 divide-y divide-rule border-y border-rule">
          {hotels.map((hotel) => {
            const qs = new URLSearchParams();
            if (checkIn) qs.set("checkIn", checkIn);
            if (checkOut) qs.set("checkOut", checkOut);
            if (guests) qs.set("guests", guests);
            const href = `/hotels/${hotel.slug}${qs.toString() ? `?${qs}` : ""}`;
            return (
              <li key={hotel.id}>
                <LocaleLink
                  to={href}
                  className="grid gap-4 py-6 md:grid-cols-[240px_1fr_160px] md:items-stretch"
                >
                  <div className="relative aspect-[4/3] w-full md:aspect-auto md:min-h-[160px]">
                    <img
                      src={asset(hotel.image)}
                      alt={loc(hotel, locale, "name")}
                      width={480}
                      height={360}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.18em] text-shu">
                      {t(`kind.${hotel.kind}`)}
                    </p>
                    <h2 className="display mt-1 text-2xl">{loc(hotel, locale, "name")}</h2>
                    <p className="mt-2 text-sm leading-6 text-ink-soft">
                      {loc(hotel, locale, "summary")}
                    </p>
                    <p className="mt-2 text-xs text-ink-soft">{walk(hotel.walkMinutes, locale)}</p>
                  </div>
                  <div className="text-right">
                    <p className="ticket-num text-lg">
                      {t("fromNight", { price: yen(hotel.priceFromYen, locale) })}
                    </p>
                    <p className="mt-1 text-xs text-ink-soft">
                      {t("rooms", { n: hotel.rooms })} · {t("rating", { n: hotel.rating, count: hotel.reviewCount })}
                    </p>
                  </div>
                </LocaleLink>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
