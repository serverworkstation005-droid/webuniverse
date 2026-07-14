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

            // Target the poster whileHover specifically:
            // whileHover={{ scale: 1.05, y: -8, zIndex: 50, transition: { type: "spring", stiffness: 80, damping: 20, mass: 1.2 } }}
            // We want to make it super smooth: stiffness 45, damping 25, mass 1.8
            content = content.replace(/stiffness:\s*80,\s*damping:\s*20,\s*mass:\s*1\.2/g, 'stiffness: 45, damping: 25, mass: 1.8');
            
            // And let's update whileTap as well
            content = content.replace(/whileTap=\{\{\s*scale:\s*0\.98,\s*transition:\s*\{\s*type:\s*"spring",\s*stiffness:\s*100,\s*damping:\s*20,\s*mass:\s*1\.0\s*\}\s*\}\}/g,
                'whileTap={{ scale: 0.98, transition: { type: "spring", stiffness: 80, damping: 25, mass: 1.5 } }}');

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated poster hover in ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(process.cwd(), 'src'));
console.log('Poster hover scales updated!');
