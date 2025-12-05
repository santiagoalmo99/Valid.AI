/**
 * Cache Service for AI Responses
 * Stores API responses in localStorage to reduce costs and latency.
 * Implements strict caching: same prompt = same answer.
 */

interface CacheItem<T> {
  value: T;
  timestamp: number;
  hash: string;
}

const CACHE_PREFIX = 'valid_ai_cache_';
const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_SIZE = 50; // Max number of items to store

class CacheService {
  
  /**
   * Generate a simple hash from a string
   */
  private generateHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Get item from cache
   */
  get<T>(key: string): T | null {
    try {
      const hash = this.generateHash(key);
      const storageKey = `${CACHE_PREFIX}${hash}`;
      const itemStr = localStorage.getItem(storageKey);
      
      if (!itemStr) return null;
      
      const item: CacheItem<T> = JSON.parse(itemStr);
      
      // Check TTL (Time To Live)
      if (Date.now() - item.timestamp > DEFAULT_TTL) {
        localStorage.removeItem(storageKey);
        return null;
      }
      
      console.log('⚡ Cache Hit');
      return item.value;
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return null;
    }
  }

  /**
   * Set item in cache
   */
  set<T>(key: string, value: T): void {
    try {
      this.enforceLimits();

      const hash = this.generateHash(key);
      const storageKey = `${CACHE_PREFIX}${hash}`;
      
      const item: CacheItem<T> = {
        value,
        timestamp: Date.now(),
        hash
      };
      
      localStorage.setItem(storageKey, JSON.stringify(item));
    } catch (error) {
      console.error('Cache set error:', error);
      // If quota exceeded, clear all cache and try again
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.clearAll();
        try {
          // Retry once
          const hash = this.generateHash(key);
          const storageKey = `${CACHE_PREFIX}${hash}`;
          const item: CacheItem<T> = { value, timestamp: Date.now(), hash };
          localStorage.setItem(storageKey, JSON.stringify(item));
        } catch (retryError) {
           console.error('Cache retry failed', retryError);
        }
      }
    }
  }

  /**
   * Enforce LRU-like limits (delete oldest if too many items)
   */
  private enforceLimits() {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_PREFIX)) {
          keys.push(key);
        }
      }

      if (keys.length >= MAX_CACHE_SIZE) {
        // Simple eviction: remove the first one found (approx random/oldest)
        // In a real LRU we'd track access times, but this is sufficient for API cost saving
        localStorage.removeItem(keys[0]);
      }
    } catch (e) {
      // Ignore errors during cleanup
    }
  }

  /**
   * Clear all AI cache
   */
  clearAll(): void {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log('🧹 Cache Cleared');
  }
}

export const cacheService = new CacheService();
