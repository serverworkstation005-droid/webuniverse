export const DB_NAME = "SmartSearchDB";
export const STORE_NAME = "LogoMetadata";

function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject("IndexedDB not supported");
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getLogoMetadata(id: string): Promise<any> {
  try {
    const db = await initDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
}

export async function saveLogoMetadata(id: string, url: string): Promise<void> {
  try {
    const db = await initDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put({ id, url, timestamp: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch (err) {}
}

export async function invalidateLogoMetadata(id: string): Promise<void> {
  try {
    const db = await initDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch (err) {}
}

export async function swrLogoMetadata(
  id: string,
  query: string,
  category: string,
  onUpdate: (newUrl: string) => void
): Promise<string | null> {
  const cached = await getLogoMetadata(id);
  
  // Background fetch
  const doFetch = async () => {
    try {
      const res = await fetch(`/api/search/image?query=${encodeURIComponent(query)}&category=${category}`);
      if (res.ok) {
        const data = await res.json();
        if (data.url && data.url !== cached?.url) {
          await saveLogoMetadata(id, data.url);
          onUpdate(data.url);
        }
      }
    } catch (err) {}
  };

  if (!cached) {
    // If no cache, we await it or just do background
  }

  doFetch(); // always revalidate
  
  return cached ? cached.url : null;
}
