import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a URL-safe slug from a string.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);
}

/**
 * Format a number with locale-appropriate separators.
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ro-RO').format(num);
}

/**
 * Truncate text to a max length, adding ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Parse JSON genres stored as a string (SQLite compatibility).
 */
export function parseGenres(genresStr: string): string[] {
  try {
    const parsed = JSON.parse(genresStr);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

/**
 * Parse JSON social links stored as a string.
 */
export function parseSocialLinks(
  linksStr: string | null,
): Record<string, string> | null {
  if (!linksStr) return null;
  try {
    return JSON.parse(linksStr);
  } catch {
    return null;
  }
}
