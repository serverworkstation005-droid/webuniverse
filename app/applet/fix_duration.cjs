const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (fullPath.includes('node_modules') || fullPath.includes('dist')) continue;
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            // Global transition duration updates
            content = content.replace(/duration-\[980ms\]/g, 'duration-[950ms]');

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated duration in ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(process.cwd(), 'src'));
console.log('Global transition duration applied!');
