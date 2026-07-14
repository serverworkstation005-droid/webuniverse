import { useEffect } from 'react';
import { getCachedSearchResults } from '../lib/indexedDbCache';

export function useImagePreloader(query: string) {
  useEffect(() => {
    if (!query || query.trim().length === 0) return;

    const prefetchForQuery = async () => {
      try {
        const pureQuery = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        // prefetch common categories
        const types = ["software", "game", "movie", "anime"];
        for (const type of types) {
           const cached = await getCachedSearchResults(pureQuery, type);
           if (cached && cached.length > 0) {
              const urls = cached.slice(0, 4).map(r => r.poster_path).filter(Boolean);
              for (const url of urls) {
                const img = new Image();
                img.src = url;
              }
           }
        }
      } catch (e) {
        // ignore
      }
    };

    const timer = setTimeout(prefetchForQuery, 500);
    return () => clearTimeout(timer);
  }, [query]);
}
