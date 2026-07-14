const fs = require('fs');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Replace array-based beziers for softer smoothness
  content = content.replace(/\[0\.22,\s*1,\s*0\.36,\s*1\]/g, '[0.23, 1, 0.32, 1]');
  content = content.replace(/\[0\.16,\s*1,\s*0\.3,\s*1\]/g, '[0.23, 1, 0.32, 1]');
  content = content.replace(/duration:\s*1\.2/g, 'duration: 0.8');
  content = content.replace(/duration:\s*1\.5/g, 'duration: 0.9');
  
  fs.writeFileSync(filePath, content);
}

['src/components/DirectoryLayout.tsx', 'src/pages/SmartSearch.tsx'].forEach(replaceInFile);
console.log('Replaced Framer beziers');
