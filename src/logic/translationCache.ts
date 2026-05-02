// ============================================================
// LOGIC - Translation Cache
// Client-side cache with localStorage persistence
// ============================================================

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
  translation: string;
  timestamp: number;
}

// In-memory cache for current session
const memoryCache = new Map<string, CacheEntry>();

function getStorageKey(): string {
  return 'qp_word_translations';
}

function loadFromStorage(): Record<string, CacheEntry> {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem(getStorageKey());
    if (saved) {
      const all = JSON.parse(saved) as Record<string, CacheEntry>;
      // Filter out expired entries
      const now = Date.now();
      for (const key of Object.keys(all)) {
        if (now - all[key].timestamp >= CACHE_TTL) {
          delete all[key];
        }
      }
      return all;
    }
  } catch { /* ignore */ }
  return {};
}

function saveToStorage(data: Record<string, CacheEntry>): void {
  if (typeof window === 'undefined') return;
  try {
    // Limit cache size
    const keys = Object.keys(data);
    if (keys.length > 500) {
      const sorted = keys.sort((a, b) => data[a].timestamp - data[b].timestamp);
      for (let i = 0; i < 100; i++) delete data[sorted[i]];
    }
    localStorage.setItem(getStorageKey(), JSON.stringify(data));
  } catch { /* ignore */ }
}

/**
 * Translate an Italian word to Arabic.
 * Checks memory cache first, then localStorage, then fetches from API.
 */
export async function translateWord(word: string): Promise<string> {
  const key = word.toLowerCase();

  // 1. Check in-memory cache
  const memCached = memoryCache.get(key);
  if (memCached && Date.now() - memCached.timestamp < CACHE_TTL) {
    return memCached.translation;
  }

  // 2. Check localStorage
  const storageData = loadFromStorage();
  const storageCached = storageData[key];
  if (storageCached && Date.now() - storageCached.timestamp < CACHE_TTL) {
    memoryCache.set(key, storageCached);
    return storageCached.translation;
  }

  // 3. Fetch from API
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'translate', word, from: 'it', to: 'ar' }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await res.json();
    const translation = data.translation || data.error || '';

    // Only cache if we got a real Arabic translation
    if (translation && /[\u0600-\u06FF]/.test(translation)) {
      const entry: CacheEntry = { translation, timestamp: Date.now() };
      memoryCache.set(key, entry);
      storageData[key] = entry;
      saveToStorage(storageData);
      return translation;
    }

    return translation; // Return empty or error string
  } catch {
    return '';
  }
}

/**
 * Get cached translation without fetching from API
 */
export function getCachedTranslation(word: string): string | null {
  const key = word.toLowerCase();
  const memCached = memoryCache.get(key);
  if (memCached && Date.now() - memCached.timestamp < CACHE_TTL) {
    return memCached.translation;
  }
  const storageData = loadFromStorage();
  const storageCached = storageData[key];
  if (storageCached && Date.now() - storageCached.timestamp < CACHE_TTL) {
    memoryCache.set(key, storageCached);
    return storageCached.translation;
  }
  return null;
}

/**
 * Pre-cache a translation manually
 */
export function setCachedTranslation(word: string, translation: string): void {
  const key = word.toLowerCase();
  const entry: CacheEntry = { translation, timestamp: Date.now() };
  memoryCache.set(key, entry);
  const storageData = loadFromStorage();
  storageData[key] = entry;
  saveToStorage(storageData);
}

/**
 * Clear all cached translations
 */
export function clearTranslationCache(): void {
  memoryCache.clear();
  if (typeof window !== 'undefined') {
    try { localStorage.removeItem(getStorageKey()); } catch { /* */ }
  }
}
