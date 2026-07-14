import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'src', 'index.css');
let content = fs.readFileSync(file, 'utf8');

// Replace timings and curves in index.css
content = content.replace(/0\.[45]s cubic-bezier\(0\.25,\s*1,\s*0\.5,\s*1\)/g, '0.6s cubic-bezier(0.16, 1, 0.3, 1)');
content = content.replace(/0\.45s cubic-bezier\(0\.25,\s*1,\s*0\.5,\s*1\)/g, '0.6s cubic-bezier(0.16, 1, 0.3, 1)');

// ensure ease-out maps to new bezier curve
content = content.replace(/transition-timing-function: cubic-bezier\(0\.25,\s*1,\s*0\.5,\s*1\) !important;/g, 'transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1) !important;');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed index.css');
