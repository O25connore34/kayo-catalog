import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Stamp } from "./Stamp";
import { LocaleSwitch } from "./LocaleSwitch";

export async function Header() {
  const t = await getTranslations("nav");
  const brand = await getTranslations("brand");

  const links = [
    { href: "/hotels" as const, label: t("hotels") },
    { href: "/tickets" as const, label: t("tickets") },
    { href: "/routes" as const, label: t("routes") },
    { href: "/desk" as const, label: t("desk") },
  ];

  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Stamp size={48} char={brand("stamp")} />
          <span className="leading-tight">
            <span className="display block text-xl text-shu">{brand("name")}</span>
            <span className="block text-[11px] tracking-[0.18em] text-ink-soft">
              {brand("kana")}
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="border border-transparent px-3 py-1.5 text-sm hover:border-shu hover:text-shu"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <LocaleSwitch />
      </div>
      <nav className="flex border-t border-rule sm:hidden">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex-1 border-r border-rule py-2 text-center text-sm last:border-r-0"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
