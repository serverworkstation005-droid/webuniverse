const fs = require('fs');
let content = fs.readFileSync('src/pages/SmartSearch.tsx', 'utf-8');
content = content.replace(/type === \"software\" \|\| type === \"system\"/g, 'type === "software" || type === "system" || type === "tool"');
content = content.replace(/catId === \"software\" \|\| catId === \"system\"/g, 'catId === "software" || catId === "system" || catId === "tool"');
content = content.replace(/cleanType === \"software\"/g, 'cleanType === "software" || cleanType === "tool"');
fs.writeFileSync('src/pages/SmartSearch.tsx', content);
