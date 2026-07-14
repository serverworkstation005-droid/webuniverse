const fs = require('fs');

let serverCode = fs.readFileSync('server.ts', 'utf8');
serverCode = serverCode.replace(/w780/g, 'w342');
serverCode = serverCode.replace(/w1280/g, 'w780'); // shrink fallback background a bit too to save time or leave it?
fs.writeFileSync('server.ts', serverCode);

let smartCode = fs.readFileSync('src/pages/SmartSearch.tsx', 'utf8');
smartCode = smartCode.replace(/w780/g, 'w342');
fs.writeFileSync('src/pages/SmartSearch.tsx', smartCode);
