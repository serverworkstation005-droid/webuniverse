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

            // Fix duplicate mass
            content = content.replace(/mass:\s*0\.85,\s*mass:\s*0\.8/g, 'mass: 0.8');

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Fixed physics in ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(process.cwd(), 'src'));
console.log('I am fixer new');
