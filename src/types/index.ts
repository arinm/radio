export interface Station {
  id: string;
  name: string;
  slug: string;
  streamUrl: string;
  streamUrlBackup: string | null;
  homepage: string | null;
  description: string | null;
  genres: string[];
  city: string | null;
  region: string | null;
  language: string;
  logoUrl: string | null;
  brandColor: string | null;
  bitrate: number | null;
  codec: string | null;
  frequency: string | null;
  isActive: boolean;
  isFeatured: boolean;
  listenScore: number;
  lastCheckedAt: Date | null;
  status: StationStatus;
  socialLinks: SocialLinks | null;
  createdAt: Date;
  updatedAt: Date;
}

export type StationStatus = 'online' | 'offline' | 'unknown' | 'error';

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
}

export interface Genre {
  slug: string;
  name: string;
  nameRo: string;
  description: string;
  stationCount: number;
}

export interface SearchResult {
  stations: Station[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PlayerState {
  station: Station | null;
  isPlaying: boolean;
  isLoading: boolean;
  isBuffering: boolean;
  volume: number;
  isMuted: boolean;
  error: string | null;
}

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing';

export interface ConsentState {
  necessary: boolean; // always true
  analytics: boolean;
  marketing: boolean;
  timestamp: string | null;
  version: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface StationFilters {
  genre?: string;
  city?: string;
  region?: string;
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
}
