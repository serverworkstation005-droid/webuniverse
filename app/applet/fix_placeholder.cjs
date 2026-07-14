const fs = require('fs');

let content = fs.readFileSync('src/components/DirectoryLayout.tsx', 'utf8');

// For the placeholder
content = content.replace(
    /key="placeholder"\s*initial=\{\{ opacity: 0 \}\}\s*animate=\{\{ opacity: 1 \}\}\s*exit=\{\{ opacity: 0 \}\}\s*transition=\{\{ type: "spring", stiffness: 110, damping: 20, mass: 1 \}\}/g,
    'key="placeholder"\n            initial={{ opacity: 1 }}\n            animate={{ opacity: 1 }}\n            exit={{ opacity: 1 }}\n            transition={{ duration: 0 }}'
);

fs.writeFileSync('src/components/DirectoryLayout.tsx', content, 'utf8');
console.log('Fixed placeholder animation.');
