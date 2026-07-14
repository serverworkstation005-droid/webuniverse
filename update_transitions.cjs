const fs = require('fs');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Update cubic-beziers to Apple-like easeOutQuint/Expo
  content = content.replace(/cubic-bezier\([^\)]+\)/g, 'cubic-bezier(0.23, 1, 0.32, 1)');
  fs.writeFileSync(filePath, content);
}

['src/index.css', 'src/components/DirectoryLayout.tsx', 'src/pages/SmartSearch.tsx'].forEach(replaceInFile);
console.log('Replaced beziers');
