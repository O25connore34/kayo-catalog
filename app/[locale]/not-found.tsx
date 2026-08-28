import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="display text-6xl text-shu">欠</p>
      <p className="mt-4 text-sm text-ink-soft">404</p>
      <Link href="/" className="mt-6 inline-block text-sm text-shu underline">
        KAYO
      </Link>
    </div>
  );
}
