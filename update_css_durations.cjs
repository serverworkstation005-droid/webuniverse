const fs = require('fs');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/0\.6s/g, '0.4s');
  content = content.replace(/1\.5s/g, '1.2s');
  fs.writeFileSync(filePath, content);
}

['src/index.css'].forEach(replaceInFile);
console.log('Replaced css durations');
