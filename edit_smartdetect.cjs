const fs = require('fs');

let code = fs.readFileSync('src/pages/SmartSearch.tsx', 'utf8');

const targetStr = `/\\b(windows|linux|ubuntu|macos|ios|android os|operating system|os|debian|mint|kali|iso file|bootable)\\b/i`;
const replaceStr = `/\\b(windows|linux|ubuntu|macos|ios|android|apk|android os|operating system|os|debian|mint|kali|iso file|bootable)\\b/i`;

code = code.replace(targetStr, replaceStr);

fs.writeFileSync('src/pages/SmartSearch.tsx', code);
