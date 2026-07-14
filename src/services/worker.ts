import { getCachedSearchResults, saveCachedSearchResults } from '../lib/indexedDbCache';

export async function cacheVisualSearchResult(imageHash: string, result: any) {
  return saveCachedSearchResults(`visual_${imageHash}`, "visual", [result]);
}

export async function getCachedVisualSearchResult(imageHash: string) {
  const res = await getCachedSearchResults(`visual_${imageHash}`, "visual");
  return res ? res[0] : null;
}
