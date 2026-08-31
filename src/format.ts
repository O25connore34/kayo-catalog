import type { Locale } from "./locale";

export function loc<T extends Record<string, string | number | null>>(
  row: T,
  locale: Locale,
  base: string,
): string {
  const key = `${base}${locale === "ja" ? "Ja" : locale === "zh" ? "Zh" : "En"}` as keyof T;
  return String(row[key] ?? "");
}

export function yen(amount: number, locale: Locale): string {
  const n = new Intl.NumberFormat("ja-JP").format(amount);
  if (locale === "ja") return `${n}円`;
  if (locale === "zh") return `${n}日元`;
  return `¥${n}`;
}

export function tokyoISO(offsetDays = 0): string {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
  );
  now.setDate(now.getDate() + offsetDays);
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = new Date(`${checkIn}T12:00:00+09:00`).getTime();
  const b = new Date(`${checkOut}T12:00:00+09:00`).getTime();
  return Math.max(1, Math.round((b - a) / 86_400_000));
}

export function duration(mins: number, locale: Locale): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (locale === "ja") {
    if (h === 0) return `${m}分`;
    return m ? `${h}時間${m}分` : `${h}時間`;
  }
  if (locale === "zh") {
    if (h === 0) return `${m}分钟`;
    return m ? `${h}小时${m}分` : `${h}小时`;
  }
  if (h === 0) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export function walk(mins: number, locale: Locale): string {
  if (locale === "ja") return `駅まで徒歩${mins}分`;
  if (locale === "zh") return `步行至车站${mins}分钟`;
  return `${mins}-minute walk to the station`;
}
