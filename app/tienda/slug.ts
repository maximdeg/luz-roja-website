/**
 * Turns a product title into a URL-safe slug: strips accents, lowercases, and
 * collapses anything non-alphanumeric into single hyphens. Pure and bounded in
 * length so it's safe as a path segment and a Storage key prefix.
 */
export function slugify(input: string): string {
  const slug = input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // drop combining accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, ""); // in case the slice cut mid-hyphen-run
  return slug || "producto";
}
