"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createBooking } from "@/lib/actions";
import { nightsBetween } from "@/lib/format";
import type { Locale } from "@/i18n/routing";

export function BookingForm({
  kind,
  itemId,
  defaultCheckIn,
  defaultCheckOut,
  defaultTravel,
  defaultGuests,
  hasSeats,
}: {
  kind: "hotel" | "ticket" | "route";
  itemId: string;
  defaultCheckIn?: string;
  defaultCheckOut?: string;
  defaultTravel?: string;
  defaultGuests?: string;
  hasSeats?: boolean;
}) {
  const t = useTranslations("book");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);
  const nights =
    defaultCheckIn && defaultCheckOut
      ? nightsBetween(defaultCheckIn, defaultCheckOut)
      : 0;

  async function onSubmit(form: FormData) {
    setPending(true);
    setError(false);
    const result = await createBooking({
      kind,
      itemId,
      locale,
      guestName: String(form.get("guestName") ?? ""),
      guestEmail: String(form.get("guestEmail") ?? ""),
      checkIn: String(form.get("checkIn") ?? "") || undefined,
      checkOut: String(form.get("checkOut") ?? "") || undefined,
      travelDate: String(form.get("travelDate") ?? "") || undefined,
      guests: Number(form.get("guests") ?? 1),
      seatClass: hasSeats
        ? (String(form.get("seatClass") ?? "reserved") as
            | "unreserved"
            | "reserved"
            | "green")
        : undefined,
      notes: String(form.get("notes") ?? "") || undefined,
    });
    setPending(false);
    if (!result.ok) {
      setError(true);
      return;
    }
    router.push(`/bookings/${result.id}`);
  }

  const field =
    "w-full border border-rule bg-paper-3 px-3 py-2 text-sm outline-none focus:border-shu";

  return (
    <form action={onSubmit} className="paper-card p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.2em] text-shu">{t("title")}</p>
          <p className="mt-2 text-sm text-ink-soft">{t("lead")}</p>
        </div>
        <span className="display text-3xl text-shu/40">届</span>
      </div>
      <div className="grid gap-3">
        <label className="grid gap-1 text-xs text-ink-soft">
          {t("name")}
          <input name="guestName" required className={field} autoComplete="name" />
        </label>
        <label className="grid gap-1 text-xs text-ink-soft">
          {t("email")}
          <input
            name="guestEmail"
            type="email"
            required
            className={field}
            autoComplete="email"
          />
        </label>
        {kind === "hotel" ? (
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1 text-xs text-ink-soft">
              <input
                type="date"
                name="checkIn"
                required
                className={field}
                defaultValue={defaultCheckIn}
              />
            </label>
            <label className="grid gap-1 text-xs text-ink-soft">
              <input
                type="date"
                name="checkOut"
                required
                className={field}
                defaultValue={defaultCheckOut}
              />
            </label>
          </div>
        ) : (
          <label className="grid gap-1 text-xs text-ink-soft">
            <input
              type="date"
              name="travelDate"
              required
              className={field}
              defaultValue={defaultTravel}
            />
          </label>
        )}
        <label className="grid gap-1 text-xs text-ink-soft">
          {t("guests")}
          <select name="guests" className={field} defaultValue={defaultGuests ?? "2"}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        {hasSeats ? (
          <label className="grid gap-1 text-xs text-ink-soft">
            {t("seat")}
            <select name="seatClass" className={field} defaultValue="reserved">
              <option value="unreserved">自由 / unreserved / 自由席</option>
              <option value="reserved">指定 / reserved / 指定席</option>
              <option value="green">Green / グリーン / 绿色车厢</option>
            </select>
          </label>
        ) : null}
        {nights > 0 ? (
          <p className="text-xs text-ink-soft">{t("nights", { n: nights })}</p>
        ) : null}
        <label className="grid gap-1 text-xs text-ink-soft">
          {t("notes")}
          <textarea name="notes" rows={3} className={field} placeholder={t("notesPh")} />
        </label>
        {error ? <p className="text-sm text-shu">{t("error")}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="bg-shu px-4 py-3 text-sm text-paper-3 hover:bg-shu-deep disabled:opacity-60"
        >
          {t("submit")}
        </button>
      </div>
    </form>
  );
}
