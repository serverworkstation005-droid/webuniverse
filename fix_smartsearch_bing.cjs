const fs = require('fs');

let code = fs.readFileSync('src/pages/SmartSearch.tsx', 'utf8');

// Replace all instances of \`https://tse2.mm.bing.net...\` with \`null\`
code = code.replace(/\`https:\/\/tse2\.mm\.bing\.net[^\`]+\`/g, 'null');

fs.writeFileSync('src/pages/SmartSearch.tsx', code);
