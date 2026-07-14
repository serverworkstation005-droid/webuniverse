const fs = require('fs');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/duration-\[600ms\]/g, 'duration-[400ms]');
  content = content.replace(/duration-700/g, 'duration-500');
  content = content.replace(/duration-\[1500ms\]/g, 'duration-[1000ms]');
  fs.writeFileSync(filePath, content);
}

['src/components/DirectoryLayout.tsx', 'src/pages/SmartSearch.tsx'].forEach(replaceInFile);
console.log('Replaced durations');
