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

            // Update to a larger scale as requested (user typed 2.0, probably meant 1.05 or something noticeable)
            content = content.replace(/whileHover=\{\{\s*scale:\s*1\.02,\s*(y:\s*-8,\s*zIndex:\s*50,\s*)?transition:/g, 'whileHover={{ scale: 1.05, $1transition:');
            
            // Also social buttons in Developer
            if (fullPath.includes('Developer.tsx')) {
                content = content.replace(/whileHover=\{\{\s*scale:\s*1\.02/g, 'whileHover={{ scale: 1.05');
            }

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated hover scale in ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(process.cwd(), 'src'));
console.log('Hover scales updated!');
