const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Fix 1: tags: ['abc'} -> tags: ['abc'],
  content = content.replace(/\]\}/g, '],');
  // Fix 2: ],\n  ],\n        type: -> something else?
  // Let's just fix the broken closing arrays.
  
  // Wait, if it looks like:
  // tags: ['Pro', 'Minimal'}
  // ],
  // type: 'Trainer',
  // logo: '...' }
  
  // My deduplication script inserted:
  // portals: [
  //    ...
  // ]
  // right where `portals: [ ... ]` was.
  
  fs.writeFileSync(filePath, content, 'utf-8');
}
