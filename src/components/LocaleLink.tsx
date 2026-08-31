import { Link, type LinkProps } from "react-router-dom";
import { useLocale } from "../i18n";
import { localePath } from "../locale-path";

export function LocaleLink({ to, ...rest }: LinkProps) {
  const locale = useLocale();
  const next = typeof to === "string" ? localePath(locale, to) : to;
  return <Link to={next} {...rest} />;
}
