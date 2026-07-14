const fs = require('fs');

let code = fs.readFileSync('src/components/DirectoryLayout.tsx', 'utf8');

const targetLogic = `    allPortals = allPortals.filter(n => {
      return n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    });
    
    allPortals.sort((a, b) => {
      const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
      const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
      return dateB - dateA; // latest first
    });`;

const newLogic = `    allPortals = allPortals.filter(n => {
      const qStr = searchQuery.toLowerCase().trim();
      if (!qStr) return true;
      const tokens = qStr.split(/\\s+/).filter(Boolean);
      
      const tStr = n.name.toLowerCase();
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
    
    allPortals.sort((a, b) => {
      const qStr = searchQuery.toLowerCase().trim();
      const aT = a.name.toLowerCase();
      const bT = b.name.toLowerCase();
      
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
      
      const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
      const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
      return dateB - dateA;
    });`;

code = code.replace(targetLogic, newLogic);

fs.writeFileSync('src/components/DirectoryLayout.tsx', code);
