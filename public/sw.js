// SmartSearch Background Service Worker with Static & Dynamic Asset Caching
// Enables offline access, faster repeat load times, and automatic metadata/image cleanup.

const STATIC_CACHE_NAME = "smartsearch-static-v3";
const DYNAMIC_CACHE_NAME = "smartsearch-dynamic-v3";

const DB_NAME = "SmartSearchImageCache";
const STORE_NAME = "images";
const DB_VERSION = 1;
const CACHE_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
const METADATA_KEY = "system_metadata_last_cleanup";

// Core essential resources to pre-cache immediately
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/favicon.svg",
  "/robots.txt",
  "/sitemap.xml",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Pre-caching core structural assets...");
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log("[ServiceWorker] Clearing legacy cache store:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    }).then(() => {
      return triggerImmediateCleanup();
    })
  );
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip state-changing requests and non-GET items
  if (event.request.method !== "GET" || (requestUrl.pathname.startsWith("/api/") && event.request.method !== "GET")) {
    return;
  }

  // Periodic indexedDB cleanup trigger
  event.waitUntil(checkAndTriggerCleanup());

  // Handle API Metadata Caching specifically (Network First)
  if (requestUrl.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return new Response(JSON.stringify({ error: "Offline metadata unavailable" }), {
            status: 503,
            headers: { "Content-Type": "application/json" }
          });
        });
      })
    );
    return;
  }

  // Intercept and load from CACHE first for static files, favicons, logos, and web fonts
  const isStaticAsset = 
    requestUrl.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2|woff|ttf|json)$/) ||
    requestUrl.hostname.includes("gstatic.com") ||
    requestUrl.hostname.includes("clearbit.com") ||
    requestUrl.hostname.includes("google.com/s2") ||
    requestUrl.hostname.includes("fonts.googleapis.com");

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Serve immediately from cache, but update it in the background for fresh assets
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          }).catch(() => {});
          return cachedResponse;
        }

        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        }).catch(() => {
          // Offline fallback
          return new Response("Asset unavailable offline", { status: 408 });
        });
      })
    );
  } else {
    // HTML / Page requests: Network-First strategy so users get the latest UI, but fallback to cache if offline
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(STATIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback to /index.html for SPA router requests
          return caches.match("/index.html");
        });
      })
    );
  }
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "TRIGGER_CLEANUP") {
    event.waitUntil(triggerImmediateCleanup());
  }
});

/**
 * Checks if the last cleanup was more than 24 hours ago, and triggers it.
 */
async function checkAndTriggerCleanup() {
  try {
    const db = await openDatabase();
    const lastCleanup = await getLastCleanupTime(db);
    const now = Date.now();
    
    if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
      console.log("[ServiceWorker] Running scheduled 24-hour IndexedDB image cache cleanup...");
      await performCleanup(db);
    }
  } catch (err) {
    console.error("[ServiceWorker] Periodic database cleanup check failed:", err);
  }
}

/**
 * Triggers an immediate cache cleanup regardless of interval.
 */
async function triggerImmediateCleanup() {
  try {
    const db = await openDatabase();
    await performCleanup(db);
  } catch (err) {
    console.error("[ServiceWorker] Immediate DB cleanup failed:", err);
  }
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "url" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getLastCleanupTime(db) {
  return new Promise((resolve) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(METADATA_KEY);
    
    request.onsuccess = () => {
      if (request.result && request.result.timestamp) {
        resolve(request.result.timestamp);
      } else {
        resolve(0); // Never cleaned up
      }
    };
    request.onerror = () => resolve(0);
  });
}

function performCleanup(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.openCursor();
    const now = Date.now();
    let deletedCount = 0;

    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        const entry = cursor.value;
        // Skip metadata key itself from deletion!
        if (entry.url !== METADATA_KEY) {
          if (now - entry.timestamp > CACHE_TTL_MS) {
            cursor.delete();
            deletedCount++;
          }
        }
        cursor.continue();
      } else {
        // Finished cursor iteration. Store the last cleanup run timestamp.
        const metaStore = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME);
        metaStore.put({
          url: METADATA_KEY,
          timestamp: now,
          dataUrl: ""
        });
        console.log(`[ServiceWorker] Cache cleanup completed. Deleted ${deletedCount} expired items.`);
        resolve();
      }
    };

    request.onerror = () => reject(request.error);
  });
}
