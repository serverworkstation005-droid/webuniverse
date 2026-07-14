const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/\|\|\s*\`https:\/\/tse2\.mm\.bing\.net[^\`]+\`/g, '|| null');
code = code.replace(/:\s*\`https:\/\/tse2\.mm\.bing\.net[^\`]+\`/g, ': null');

fs.writeFileSync('server.ts', code);
