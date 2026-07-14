const fs = require('fs');
const path = require('path');
const appPath = path.join(__dirname, 'src/App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');

appContent = appContent.replace(
  /initial=\{\{ opacity: 0, y: 30 \}\}/,
  'initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}'
);
appContent = appContent.replace(
  /animate=\{\{ opacity: 1, y: 0 \}\}/,
  'animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}'
);
appContent = appContent.replace(
  /exit=\{\{ opacity: 0, transition: \{ duration: 0\.1 \} \}\}/,
  'exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 0.15, ease: "easeOut" } }}'
);
appContent = appContent.replace(
  /transition=\{\{ type: "spring", stiffness: 150, damping: 20, mass: 1\.2 \}\}/,
  'transition={{ type: "spring", stiffness: 220, damping: 25, mass: 0.5 }}'
);
appContent = appContent.replace(
  /transition=\{\{ type: "spring", stiffness: 150, damping: 20, mass: 1 \}\}/,
  'transition={{ type: "spring", stiffness: 220, damping: 25, mass: 0.5 }}'
);

fs.writeFileSync(appPath, appContent, 'utf8');
console.log('Fixed routing delay in App.tsx');
