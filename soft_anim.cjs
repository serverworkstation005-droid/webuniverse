const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            // Make CSS transitions longer
            content = content.replace(/duration-\[600ms\]/g, 'duration-[800ms]');
            
            // Adjust framer motion physics to softer settings
            // We'll leave stiffness: 200 alone and maybe adjust delay and transition in Categories and DirectoryLayout
            content = content.replace(/stiffness: 200, damping: 25/g, 'stiffness: 150, damping: 20, mass: 1');

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated softer animations in ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(__dirname, 'src'));
console.log('Done soft animations!');
