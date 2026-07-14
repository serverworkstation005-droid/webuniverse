const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // We need to parse or string manipulate to drop duplicates.
  // Given the complexity of TSX files, regex extraction of arrays might be error prone.
  // Let's use a simpler approach: extract all `{ name: '...', domain: '...', ... }` blocks,
  // evaluate them or parse them to JSON-like objects, filter out duplicates, and reconstruct.
}
