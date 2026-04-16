/**
 * Build in-app note viewer URL from a note path (relative to repo root).
 */
export function notePathToHref(notePath: string): string {
  const normalized = notePath.replace(/\.md$/i, "");
  const segments = normalized.split("/").map(encodeURIComponent);
  return `/note/${segments.join("/")}`;
}
