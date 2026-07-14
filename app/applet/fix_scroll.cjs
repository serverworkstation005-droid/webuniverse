const fs = require('fs');
let code = fs.readFileSync('src/pages/SmartSearch.tsx', 'utf8');

// Replace overflow-x-auto with flex-wrap and remove horizontal scrolling completely
code = code.replace(/overflow-x-auto hide-scrollbar/g, '');
code = code.replace(/flex-nowrap sm:flex-wrap/g, 'flex-wrap');

// Fix aspect ratios: remove fixed h-full min-h-[220px] 
code = code.replace(/h-full min-h-\[220px\]/g, 'h-auto w-full aspect-[2/3]');

fs.writeFileSync('src/pages/SmartSearch.tsx', code);
