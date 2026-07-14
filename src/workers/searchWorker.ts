/// <reference lib="webworker" />

import { saveCachedSearchResults } from '../lib/indexedDbCache';

self.onmessage = async (e: MessageEvent) => {
  const { query, type, results } = e.data;
  
  if (!results || !Array.isArray(results)) {
     self.postMessage({ type, results: [], query });
     return;
  }

  let scoredResults = results.map(item => {
    let score = item.score || 0; 
    const tLower = (item.title || "").toLowerCase();
    const qLower = (query || "").toLowerCase();
    if (tLower === qLower) score += 1000;
    else if (tLower.startsWith(qLower)) score += 500;
    else if (tLower.includes(qLower)) score += 100;
    
    const hasValidPoster = item.poster_path && !item.poster_path.includes("logo.clearbit.com") && !item.poster_path.includes("s2/favicons");
    if (hasValidPoster) score += 200;
    else score -= 100;
    
    return { ...item, score };
  });
  
  scoredResults.sort((a, b) => b.score - a.score);
  
  try {
     await saveCachedSearchResults(query, type, scoredResults);
  } catch (err) { }
  
  self.postMessage({ type, results: scoredResults, query });
};
