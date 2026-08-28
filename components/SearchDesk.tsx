"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { City } from "@/lib/schema";
import type { Locale } from "@/i18n/routing";
import { loc } from "@/lib/format";

type Tab = "hotels" | "tickets" | "routes";

export function SearchDesk({
  cities,
  locale,
  defaults,
}: {
  cities: City[];
  locale: Locale;
  defaults: { checkIn: string; checkOut: string; travelDate: string };
}) {
  const t = useTranslations("search");
  const [tab, setTab] = useState<Tab>("hotels");

  const tabs: { id: Tab; label: string }[] = [
    { id: "hotels", label: t("hotels") },
    { id: "tickets", label: t("tickets") },
    { id: "routes", label: t("routes") },
  ];

  const field =
    "w-full border border-rule bg-paper-3 px-3 py-2 text-sm outline-none focus:border-shu";

  return (
    <div className="paper-card">
      <div className="flex border-b border-rule">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.id}
            type="button"
            onClick={() => setTab(tabItem.id)}
            className={`flex-1 py-3 text-sm ${
              tab === tabItem.id
                ? "bg-pine text-paper-3"
                : "bg-paper-2 text-ink-soft"
            }`}
          >
            {tabItem.label}
          </button>
        ))}
      </div>
      <div className="p-5">
        {tab === "hotels" ? (
          <form action={`/${locale}/hotels`} method="get" className="grid gap-3">
            <label className="grid gap-1 text-xs text-ink-soft">
              {t("city")}
              <select name="city" className={field} defaultValue="">
                <option value="">{t("anyCity")}</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {loc(c, locale, "name")}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1 text-xs text-ink-soft">
                {t("checkIn")}
                <input
                  type="date"
                  name="checkIn"
                  className={field}
                  defaultValue={defaults.checkIn}
                  required
                />
              </label>
              <label className="grid gap-1 text-xs text-ink-soft">
                {t("checkOut")}
                <input
                  type="date"
                  name="checkOut"
                  className={field}
                  defaultValue={defaults.checkOut}
                  required
                />
              </label>
            </div>
            <label className="grid gap-1 text-xs text-ink-soft">
              {t("guests")}
              <select name="guests" className={field} defaultValue="2">
                <option value="1">{t("guestOne")}</option>
                {[2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {t("guestN", { n })}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="mt-1 bg-shu px-4 py-3 text-sm text-paper-3 hover:bg-shu-deep"
            >
              {t("submitHotels")}
            </button>
          </form>
        ) : null}
        {tab === "tickets" ? (
          <form action={`/${locale}/tickets`} method="get" className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1 text-xs text-ink-soft">
                {t("from")}
                <select name="from" className={field} defaultValue="tokyo">
                  <option value="">{t("anyCity")}</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {loc(c, locale, "name")}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-xs text-ink-soft">
                {t("to")}
                <select name="to" className={field} defaultValue="kyoto">
                  <option value="">{t("anyCity")}</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {loc(c, locale, "name")}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="grid gap-1 text-xs text-ink-soft">
              {t("date")}
              <input
                type="date"
                name="date"
                className={field}
                defaultValue={defaults.travelDate}
                required
              />
            </label>
            <label className="grid gap-1 text-xs text-ink-soft">
              {t("pax")}
              <select name="pax" className={field} defaultValue="2">
                <option value="1">{t("guestOne")}</option>
                {[2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {t("guestN", { n })}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="mt-1 bg-shu px-4 py-3 text-sm text-paper-3 hover:bg-shu-deep"
            >
              {t("submitTickets")}
            </button>
          </form>
        ) : null}
        {tab === "routes" ? (
          <form action={`/${locale}/routes`} method="get" className="grid gap-3">
            <label className="grid gap-1 text-xs text-ink-soft">
              {t("nights")}
              <select name="nights" className={field} defaultValue="">
                <option value="">{t("anyNights")}</option>
                {[5, 6, 7].map((n) => (
                  <option key={n} value={n}>
                    {t("nightN", { n })}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="mt-1 bg-shu px-4 py-3 text-sm text-paper-3 hover:bg-shu-deep"
            >
              {t("submitRoutes")}
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
