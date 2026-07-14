const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            content = content.replace(/duration-\[900ms\]/g, 'duration-[1200ms]');
            content = content.replace(/duration-900/g, 'duration-1000'); // If there are any

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated physics in ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join('/app/applet', 'src'));
console.log('Global smooth upgrade applied!');
