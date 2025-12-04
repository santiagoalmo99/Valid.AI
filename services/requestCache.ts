// services/requestCache.ts - Persistent Cache with localStorage
// Enhanced version with localStorage persistence

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const STORAGE_KEY = 'validai_api_cache';
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export class RequestCache {
  private static instance: RequestCache;
  private memoryCache: Map<string, CacheEntry<any>> = new Map();

  private constructor() {
    this.loadFromLocalStorage();
    this.cleanupOldEntries();
  }

  static getInstance(): RequestCache {
    if (!RequestCache.instance) {
      RequestCache.instance = new RequestCache();
    }
    return RequestCache.instance;
  }

  /**
   * Load cache from localStorage on init
   */
  private loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        Object.entries(parsed).forEach(([key, entry]: [string, any]) => {
          this.memoryCache.set(key, entry);
        });
        console.log('📦 [Cache] Loaded', this.memoryCache.size, 'entries from localStorage');
      }
    } catch (err) {
      console.error('[Cache] Failed to load from localStorage:', err);
    }
  }

  /**
   * Save cache to localStorage
   */
  private saveToLocalStorage(): void {
    try {
      const cacheObj: Record<string, CacheEntry<any>> = {};
      this.memoryCache.forEach((value, key) => {
        cacheObj[key] = value;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheObj));
    } catch (err) {
      console.error('[Cache] Failed to save to localStorage:', err);
      // If quota exceeded, clear old entries
      if (err instanceof DOMException && err.name === 'QuotaExceededError') {
        this.cleanupOldEntries();
        try {
          const cacheObj: Record<string, CacheEntry<any>> = {};
          this.memoryCache.forEach((value, key) => {
            cacheObj[key] = value;
          });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheObj));
        } catch {
          console.error('[Cache] Still failed after cleanup');
        }
      }
    }
  }

  /**
   * Remove entries older than MAX_CACHE_AGE
   */
  private cleanupOldEntries(): void {
    const now = Date.now();
    let removed = 0;
    
    this.memoryCache.forEach((entry, key) => {
      if (now - entry.timestamp > MAX_CACHE_AGE) {
        this.memoryCache.delete(key);
        removed++;
      }
    });
    
    if (removed > 0) {
      console.log(`🧹 [Cache] Cleaned up ${removed} old entries`);
      this.saveToLocalStorage();
    }
  }

  /**
   * Generate cache key from content
   */
  private hashKey(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return 'cache_' + Math.abs(hash).toString(36);
  }

  /**
   * Set a value in the cache (with localStorage persistence)
   */
  set<T>(key: string, data: T, ttl: number = 24 * 60 * 60 * 1000): void {
    const hashedKey = this.hashKey(key);
    
    this.memoryCache.set(hashedKey, {
      data,
      timestamp: Date.now(),
      ttl
    });
    
    // Persist to localStorage
    this.saveToLocalStorage();
    
    console.log('💾 [Cache] Saved:', hashedKey.substring(0, 12) + '...');
  }

  /**
   * Get a value from the cache
   */
  get<T>(key: string): T | null {
    const hashedKey = this.hashKey(key);
    const entry = this.memoryCache.get(hashedKey);
    
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.memoryCache.delete(hashedKey);
      this.saveToLocalStorage();
      console.log('⏰ [Cache] Expired:', hashedKey.substring(0, 12) + '...');
      return null;
    }

    console.log('✅ [Cache] Hit:', hashedKey.substring(0, 12) + '...');
    return entry.data as T;
  }

  /**
   * Clear the entire cache
   */
  clear(): void {
    this.memoryCache.clear();
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ [Cache] Cleared all entries');
  }

  /**
   * Remove a specific item
   */
  remove(key: string): void {
    const hashedKey = this.hashKey(key);
    this.memoryCache.delete(hashedKey);
    this.saveToLocalStorage();
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; oldestEntry: number; newestEntry: number } {
    let oldest = Date.now();
    let newest = 0;
    
    this.memoryCache.forEach(entry => {
      if (entry.timestamp < oldest) oldest = entry.timestamp;
      if (entry.timestamp > newest) newest = entry.timestamp;
    });
    
    return {
      size: this.memoryCache.size,
      oldestEntry: oldest,
      newestEntry: newest
    };
  }
}

export const requestCache = RequestCache.getInstance();
