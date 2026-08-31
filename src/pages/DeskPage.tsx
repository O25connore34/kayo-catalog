import { useT } from "../i18n";

export function DeskPage() {
  const t = useT("desk");
  const blocks = [
    { t: t("p1t"), b: t("p1") },
    { t: t("p2t"), b: t("p2") },
    { t: t("p3t"), b: t("p3") },
    { t: t("p4t"), b: t("p4") },
    { t: t("p5t"), b: t("p5") },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs tracking-[0.25em] text-shu">{t("hours")}</p>
      <h1 className="display mt-3 text-4xl">{t("title")}</h1>
      <p className="mt-4 text-base leading-8 text-ink-soft">{t("lead")}</p>
      <ol className="mt-10 space-y-8">
        {blocks.map((block, i) => (
          <li key={block.t} className="grid grid-cols-[3rem_1fr] gap-4">
            <span className="display text-3xl text-shu">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2 className="display text-2xl">{block.t}</h2>
              <p className="mt-2 text-sm leading-7">{block.b}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
