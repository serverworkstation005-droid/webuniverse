const fs = require('fs');
let code = fs.readFileSync('src/pages/SmartSearch.tsx', 'utf8');

code = code.replace(/overflow-x-auto/g, 'flex-wrap');
code = code.replace(/hide-scrollbar/g, '');
code = code.replace(/flex-nowrap sm:flex-wrap/g, 'flex-wrap');
code = code.replace(/flex-nowrap/g, 'flex-wrap');

fs.writeFileSync('src/pages/SmartSearch.tsx', code);
