const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // We want to replace `['something'}\n  ],\n` with `['something'],\n` when followed by `type:`
  // Or `['something'}\n];\n` with `['something'],\n`
  
  // Actually, we can just replace the erroneous insertions:
  // Regex: `\}\n\s*\][;,]?\n\s*type:` -> `],\n        type:`
  content = content.replace(/\}\s*\n\s*\][;,]?\s*\n(\s*type:)/g, '],\n$1');

  fs.writeFileSync(filePath, content, 'utf-8');
}
console.log('Fixed arrays');
