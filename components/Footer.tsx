import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");
  const brand = await getTranslations("brand");

  return (
    <footer className="mt-auto border-t-2 border-shu">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-[1fr_2fr]">
        <p className="display text-2xl text-shu">{brand("name")}</p>
        <div className="space-y-2 text-sm text-ink-soft">
          <p>{t("hours")}</p>
          <p>{t("copy")}</p>
          <p>{t("note")}</p>
        </div>
      </div>
    </footer>
  );
}
