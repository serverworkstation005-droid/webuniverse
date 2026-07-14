const fs = require('fs');
const path = require('path');
const appPath = path.join(__dirname, 'src/App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');
appContent = appContent.replace(/mass: 1, mass: 0\.8/g, 'mass: 1.2');
fs.writeFileSync(appPath, appContent, 'utf8');
console.log('Fixed mass syntax in App.tsx');
