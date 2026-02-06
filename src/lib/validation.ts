import { z } from 'zod';

// Strict URL validation - prevents injection and XSS
const safeUrlSchema = z
  .string()
  .url()
  .refine(
    (url) => {
      try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
      } catch {
        return false;
      }
    },
    { message: 'URL must use http or https protocol' },
  );

// Stream URL validation - audio stream URLs
const streamUrlSchema = z
  .string()
  .url()
  .refine(
    (url) => {
      try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
      } catch {
        return false;
      }
    },
    { message: 'Stream URL must use http or https protocol' },
  );

// Slug validation - URL-safe identifiers
const slugSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format');

// Station input validation
export const stationInputSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  slug: slugSchema,
  streamUrl: streamUrlSchema,
  streamUrlBackup: streamUrlSchema.nullable().optional(),
  homepage: safeUrlSchema.nullable().optional(),
  description: z.string().max(2000).trim().nullable().optional(),
  genres: z.array(z.string().min(1).max(50)).max(10).default([]),
  city: z.string().max(100).trim().nullable().optional(),
  region: z.string().max(100).trim().nullable().optional(),
  language: z.string().max(10).default('ro'),
  logoUrl: safeUrlSchema.nullable().optional(),
  bitrate: z.number().int().min(0).max(1024).nullable().optional(),
  codec: z.string().max(20).nullable().optional(),
  frequency: z.string().max(20).nullable().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  socialLinks: z
    .object({
      facebook: safeUrlSchema.optional(),
      instagram: safeUrlSchema.optional(),
      twitter: safeUrlSchema.optional(),
      youtube: safeUrlSchema.optional(),
      tiktok: safeUrlSchema.optional(),
    })
    .nullable()
    .optional(),
});

// Search query validation
export const searchQuerySchema = z.object({
  q: z.string().min(1).max(200).trim(),
  genre: z.string().max(50).optional(),
  city: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(24),
});

// Pagination validation
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(24),
});

// Health check URL validation
export const healthCheckUrlSchema = z.object({
  url: streamUrlSchema,
});

// Station slug param validation
export const stationSlugSchema = z.object({
  slug: slugSchema,
});

// Genre slug param validation
export const genreSlugSchema = z.object({
  slug: slugSchema,
});

// Text sanitization - strip potential XSS vectors
export function sanitizeText(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

// Validate and sanitize search input
export function sanitizeSearchQuery(query: string): string {
  return sanitizeText(query).slice(0, 200);
}

export type StationInput = z.infer<typeof stationInputSchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
