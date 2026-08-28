import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BookingForm } from "@/components/BookingForm";
import { getHotel, listReviews } from "@/lib/queries";
import { loc, tokyoISO, walk, yen } from "@/lib/format";
import type { Locale } from "@/i18n/routing";

export default async function HotelDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string }>;
}) {
  const { locale: locParam, slug } = await params;
  const locale = locParam as Locale;
  setRequestLocale(locale);
  const q = await searchParams;
  const hotel = await getHotel(slug);
  if (!hotel) notFound();
  const t = await getTranslations("hotels");
  const am = await getTranslations("amenities");
  const reviews = await listReviews("hotel", hotel.id);
  const amenities = hotel.amenities.split(",").filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/hotels" className="text-sm text-shu">
        ← {t("back")}
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="relative h-80 border border-rule">
            <Image
              src={hotel.image}
              alt={loc(hotel, locale, "name")}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 60vw, 100vw"
              priority
            />
          </div>
          <p className="mt-6 text-xs tracking-[0.2em] text-shu">{t(`kind.${hotel.kind}`)}</p>
          <h1 className="display mt-2 text-4xl">{loc(hotel, locale, "name")}</h1>
          <p className="mt-4 text-base leading-8">{loc(hotel, locale, "body")}</p>
          <dl className="mt-8 grid gap-4 border-t border-rule pt-6 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-ink-soft">{t("station")}</dt>
              <dd className="mt-1">{loc(hotel, locale, "station")}</dd>
              <dd className="text-xs text-ink-soft">{walk(hotel.walkMinutes, locale)}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-soft">{t("address")}</dt>
              <dd className="mt-1">{loc(hotel, locale, "address")}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-soft">{t("hours")}</dt>
              <dd className="mt-1">
                {t("checkIn", { time: hotel.checkIn })} / {t("checkOut", { time: hotel.checkOut })}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-soft">{t("rooms", { n: hotel.rooms })}</dt>
              <dd className="mt-1 ticket-num">
                {t("fromNight", { price: yen(hotel.priceFromYen, locale) })}
              </dd>
            </div>
          </dl>
          <div className="mt-8">
            <h2 className="display text-xl">{t("amenities")}</h2>
            <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              {amenities.map((key) => (
                <li key={key} className="border-l-2 border-ochre pl-3">
                  {am(key)}
                </li>
              ))}
            </ul>
          </div>
          {reviews.length > 0 ? (
            <div className="mt-10 space-y-6">
              {reviews.map((review) => (
                <blockquote key={review.id} className="grid grid-cols-[56px_1fr] gap-3">
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
          ) : null}
        </div>
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <p className="mb-3 text-sm">
            {t("book")} · {t("fromNight", { price: yen(hotel.priceFromYen, locale) })}
          </p>
          <BookingForm
            kind="hotel"
            itemId={hotel.id}
            defaultCheckIn={q.checkIn ?? tokyoISO(14)}
            defaultCheckOut={q.checkOut ?? tokyoISO(17)}
            defaultGuests={q.guests ?? "2"}
          />
        </aside>
      </div>
    </div>
  );
}
