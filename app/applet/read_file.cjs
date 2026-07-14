const fs = require('fs');
const content = fs.readFileSync('src/components/DirectoryLayout.tsx', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(250, 320).join('\n'));
