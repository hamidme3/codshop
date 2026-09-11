/**
 * Security Sanitization & Anti-XSS Utilities for CODShop
 * Strictly cleanses and validates inputs before storage and dashboard presentation.
 */

/**
 * Strips HTML tags, script blocks, dangerous attributes, and dangerous protocols
 * to prevent Stored XSS in admin dashboards, reports, and printable sheets.
 */
export function sanitizeText(input: unknown, maxLength = 300): string {
  if (typeof input !== 'string') {
    return '';
  }

  // 1. Remove null bytes and invisible control characters
  let clean = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\uFFFE\uFFFF]/g, '');

  // 2. Strip script, style, iframe, object, embed tags along with inner content
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  clean = clean.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  clean = clean.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');

  // 3. Strip all other HTML/XML tags
  clean = clean.replace(/<\/?[a-z][a-z0-9]*\b[^>]*>/gi, '');
  clean = clean.replace(/<[^>]*>?/g, '');

  // 4. Strip dangerous URI schemes
  clean = clean.replace(/(?:javascript|vbscript|data):/gi, '');

  // 5. Strip dangerous inline event handler attributes
  clean = clean.replace(/\bon[a-z]+\s*=/gi, '');

  // 6. Strip bare angle brackets and dangerous escape characters
  clean = clean.replace(/[<>]/g, '');

  // 7. Normalize multi-whitespace and trim
  clean = clean.replace(/\s+/g, ' ').trim();

  // 8. Enforce maximum length
  if (clean.length > maxLength) {
    clean = clean.slice(0, maxLength).trim();
  }

  return clean;
}

/**
 * HTML Entity Encoder for safe HTML output interpolation (defense in depth).
 */
export function escapeHtml(input: unknown): string {
  if (input === null || input === undefined) return '';
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validates store slug format (lowercase alphanumeric and single hyphens).
 */
export function isValidStoreSlug(slug: unknown): boolean {
  if (typeof slug !== 'string') return false;
  const s = slug.trim();
  if (s.length < 2 || s.length > 64) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);
}
