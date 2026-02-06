/**
 * Simple in-memory cache with TTL support.
 * For production at scale, replace with Redis.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private maxSize = 1000;

  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, data: T, ttlSeconds: number): void {
    // Evict if at capacity
    if (this.store.size >= this.maxSize) {
      const firstKey = this.store.keys().next().value;
      if (firstKey) this.store.delete(firstKey);
    }

    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}

// Singleton cache instance
export const cache = new MemoryCache();

/**
 * Cache wrapper that returns cached data or fetches fresh data.
 */
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const existing = cache.get<T>(key);
  if (existing !== null) return existing;

  const data = await fetcher();
  cache.set(key, data, ttlSeconds);
  return data;
}
