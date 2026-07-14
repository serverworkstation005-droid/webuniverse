const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

// Replace standard bing fallbacks with null so the frontend's thematic engine takes over!
// We'll use regex to match all `https://tse2.mm.bing.net...` patterns and replace with null.

code = code.replace(/:\s*\`https:\/\/tse2\.mm\.bing\.net[^\`]+\`/g, ': null');

fs.writeFileSync('server.ts', code);
