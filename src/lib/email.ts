/**
 * 2026-08-20 — wrap-safe email rendering. A full address is one unbreakable
 * ~38-char string that no longer fits a phone line at the +10% root, and the
 * sitewide `a[href^="mailto:"] { overflow-wrap: anywhere }` fallback breaks it
 * at arbitrary characters ("…storytellingme / dia.com"). Render sites split
 * the address with this helper and put <wbr /> between the parts so a needed
 * break lands after the "@" or before the TLD dot; the CSS fallback stays as
 * the last resort for containers narrower than any part.
 */
export function emailParts(address: string) {
  const at = address.indexOf("@");
  const local = address.slice(0, at + 1); // "name@" — the @ stays with the local part
  const domain = address.slice(at + 1);
  const dot = domain.lastIndexOf(".");
  return { local, domainName: domain.slice(0, dot), tld: domain.slice(dot) };
}
