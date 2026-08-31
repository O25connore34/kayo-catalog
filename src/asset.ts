export function asset(path: string | null | undefined) {
  if (!path) return "";
  if (/^(https?:|data:)/i.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
