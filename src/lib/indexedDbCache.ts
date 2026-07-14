// Modern Persistent Cache API Service
// Stores cross-origin compatible assets without base64 conversion overhead.

const CACHE_NAME = "SmartSearchImageCache-v2";
export const inlineMemoryCache = new Map<string, string>(); // Keep tracking loaded URLs

/**
 * Retrieves an image from the persistent Cache API
 */
export async function getCachedImage(url: string): Promise<string | null> {
  const memoryHit = inlineMemoryCache.get(url);
  if (memoryHit) return memoryHit;

  if (typeof window === "undefined" || !window.caches) return null;

  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(url);
    if (!response) {
      return null;
    }

    // Convert the cached response into an ObjectURL to bypass re-downloading
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    inlineMemoryCache.set(url, objectUrl);
    return objectUrl;
  } catch (err) {
    return null;
  }
}

/**
 * Saves an image to the persistent cache using the Cache API.
 */
export async function saveImageToCache(url: string): Promise<string | null> {
  if (!url || url.startsWith("data:") || url.startsWith("blob:")) return null;

  if (typeof window === "undefined" || !window.caches) return null;

  try {
    const response = await fetch(url, {
      credentials: "omit",
      cache: "force-cache" // Browser handles caching
    });

    if (!response.ok) {
      return null;
    }

    const cache = await caches.open(CACHE_NAME);
    await cache.put(url, response.clone());
    
    // Convert to ObjectURL for immediate memory use
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    inlineMemoryCache.set(url, objectUrl);
    
    return objectUrl;
  } catch (err) {
    return null;
  }
}

/**
 * Pre-fetches an array of image URLs
 */
export async function prefetchImages(urls: string[]) {
  if (typeof window === "undefined" || !window.caches) return;
  const cache = await caches.open(CACHE_NAME);
  
  // Throttle prefetching to avoid blocking network
  const BATCH_SIZE = 4;
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    await Promise.allSettled(
      batch.map(async (url) => {
        if (!url || url.startsWith("data:") || url.startsWith("blob:")) return;
        const exist = await cache.match(url);
        if (exist) return;

        try {
          const res = await fetch(url, { credentials: "omit", cache: "force-cache" });
          if (res.ok) await cache.put(url, res);
        } catch {
          // Ignore prefetch failures
        }
      })
    );
  }
}

/**
 * Permanently deletes a single item from the cache
 */
export async function deleteCachedImage(url: string): Promise<void> {
  if (typeof window === "undefined" || !window.caches) return;
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.delete(url);
  } catch (err) {}
}

/**
 * Clear cache
 */
export async function clearImageCache() {
  if (typeof window === "undefined" || !window.caches) return;
  try {
    await caches.delete(CACHE_NAME);
    for (const val of inlineMemoryCache.values()) {
      if (val.startsWith("blob:")) URL.revokeObjectURL(val);
    }
    inlineMemoryCache.clear();
  } catch (err) {}
}

// ----------------------------------------------------------------------
// IndexedDB: Full Search Results Cache
// ----------------------------------------------------------------------

const METADATA_STORE_NAME = "SearchResultsCache";

async function initMetadataDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject("IndexedDB not supported");
      return;
    }
    const request = indexedDB.open("SmartSearchAPIResultsDB", 1);
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(METADATA_STORE_NAME)) {
        db.createObjectStore(METADATA_STORE_NAME, { keyPath: "cacheKey" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getCachedSearchResults(query: string, type: string): Promise<any[] | null> {
  const cacheKey = `${type}_${query.toLowerCase().trim()}`;
  try {
    const db = await initMetadataDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(METADATA_STORE_NAME, "readonly");
      const store = transaction.objectStore(METADATA_STORE_NAME);
      const request = store.get(cacheKey);
      request.onsuccess = () => {
        if (request.result && request.result.results) {
          // Verify age? Let's just return if it exists to be fast.
          resolve(request.result.results);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
}

export async function saveCachedSearchResults(query: string, type: string, results: any[]): Promise<void> {
  const cacheKey = `${type}_${query.toLowerCase().trim()}`;
  try {
    const db = await initMetadataDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(METADATA_STORE_NAME, "readwrite");
      const store = transaction.objectStore(METADATA_STORE_NAME);
      const request = store.put({ cacheKey, results, timestamp: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });
  } catch (err) {
    // Ignore db errors
  }
}

const IDB_NAME = "SmartSearchMetadataDB";
const STORE_NAME = "IconMappings";

function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject("IndexedDB not supported");
      return;
    }
    const request = indexedDB.open(IDB_NAME, 1);
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "name" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get icon mapped URL from IndexedDB by item name
 */
export async function getMappedIconUrl(name: string): Promise<string | null> {
  const normName = name.toLowerCase().trim();
  if (!normName) return null;
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(normName);
      request.onsuccess = () => {
        if (request.result && request.result.url) {
          resolve(request.result.url);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
}

/**
 * Save icon mapped URL to IndexedDB for item name
 */
export async function saveMappedIconUrl(name: string, url: string): Promise<void> {
  const normName = name.toLowerCase().trim();
  if (!normName || !url) return;
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({ name: normName, url, timestamp: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => resolve(); // swallow errors safely
    });
  } catch (err) {
    // Ignore db errors
  }
}
