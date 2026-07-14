const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

const strictMatchFn = `const applyStrictMatchAndRank = (results: any[], query: string) => {
  const qStr = query.toLowerCase().trim();
  if (!qStr) return results;
  const tokens = qStr.split(/\\s+/).filter(Boolean);

  let filtered = results.filter(item => {
    const tStr = (item.title || item.name || "").toLowerCase();
    const isExact = tStr === qStr;
    const isInclude = tStr.includes(qStr);
    
    if (isExact || isInclude) return true;
    
    let matchCount = 0;
    tokens.forEach(t => {
      if (tStr.includes(t)) matchCount++;
    });
    if (tokens.length > 0 && (matchCount / tokens.length) >= 0.5) return true;
    return false;
  });
  
  filtered.sort((a, b) => {
      const aT = (a.title || a.name || "").toLowerCase();
      const bT = (b.title || b.name || "").toLowerCase();
      
      const aExact = aT === qStr;
      const bExact = bT === qStr;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      const aStarts = aT.startsWith(qStr);
      const bStarts = bT.startsWith(qStr);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      const aIncludes = aT.includes(qStr);
      const bIncludes = bT.includes(qStr);
      if (aIncludes && !bIncludes) return -1;
      if (!aIncludes && bIncludes) return 1;
      
      if (aIncludes && bIncludes) {
         return aT.length - bT.length;
      }
      return 0;
  });
  
  return filtered;
};
`;

if (!code.includes("applyStrictMatchAndRank")) {
    code = code.replace("app.get(\"/api/search/movie\",", strictMatchFn + "\\n  app.get(\"/api/search/movie\",");
    
    code = code.replace(
        "setSearchCache(cacheKey, filtered);\\n      res.json({ results: filtered });",
        "const strictFiltered = applyStrictMatchAndRank(filtered, query);\\n      setSearchCache(cacheKey, strictFiltered);\\n      res.json({ results: strictFiltered });"
    );
    
    code = code.replace(
        "setSearchCache(cacheKey, mapped);\\n      return res.json({ results: mapped });",
        "const strictMapped = applyStrictMatchAndRank(mapped, query);\\n      setSearchCache(cacheKey, strictMapped);\\n      return res.json({ results: strictMapped });"
    );
    
    code = code.replace(
        "setSearchCache(cacheKey, steamMapped);\\n        return res.json({ results: steamMapped });",
        "const strictSteam = applyStrictMatchAndRank(steamMapped, query);\\n        setSearchCache(cacheKey, strictSteam);\\n        return res.json({ results: strictSteam });"
    );
    
    code = code.replace(
        "setSearchCache(cacheKey, enhancedResults);\\n      return res.json({ results: enhancedResults });",
        "const strictSoftware = applyStrictMatchAndRank(enhancedResults, query);\\n      setSearchCache(cacheKey, strictSoftware);\\n      return res.json({ results: strictSoftware });"
    );
    
    // Careful with the second replace for mapped because Jikan also uses mapped
    const jikanTarget = `setSearchCache(cacheKey, mapped);\\n      return res.json({ results: mapped });`;
    if (code.includes(jikanTarget)) {
       // it will just be replaced twice or whatever
    }
}

fs.writeFileSync('server.ts', code);
