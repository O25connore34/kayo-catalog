import { LocaleLink } from "./LocaleLink";
import { LocaleSwitch } from "./LocaleSwitch";
import { Stamp } from "./Stamp";
import { useT } from "../i18n";

export function Header() {
  const t = useT("nav");
  const brand = useT("brand");

  const links = [
    { href: "/hotels", label: t("hotels") },
    { href: "/tickets", label: t("tickets") },
    { href: "/routes", label: t("routes") },
    { href: "/desk", label: t("desk") },
  ];

  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <LocaleLink to="/" className="flex items-center gap-3">
          <Stamp size={48} char={brand("stamp")} />
          <span className="leading-tight">
            <span className="display block text-xl text-shu">{brand("name")}</span>
            <span className="block text-[11px] tracking-[0.18em] text-ink-soft">
              {brand("kana")}
            </span>
          </span>
        </LocaleLink>
        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <LocaleLink
              key={l.href}
              to={l.href}
              className="border border-transparent px-3 py-1.5 text-sm hover:border-shu hover:text-shu"
            >
              {l.label}
            </LocaleLink>
          ))}
        </nav>
        <LocaleSwitch />
      </div>
      <nav className="flex border-t border-rule sm:hidden">
        {links.map((l) => (
          <LocaleLink
            key={l.href}
            to={l.href}
            className="flex-1 border-r border-rule py-2 text-center text-sm last:border-r-0"
          >
            {l.label}
          </LocaleLink>
        ))}
      </nav>
    </header>
  );
}
