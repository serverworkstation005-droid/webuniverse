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
            // whileHover={{ scale: 1.05, y: -8, zIndex: 50, transition: { type: "spring", stiffness: 180, damping: 25, mass: 0.8 } }}
            content = content.replace(/whileHover=\{\{\s*scale:\s*1\.05,\s*y:\s*-8,\s*zIndex:\s*50,\s*transition:\s*\{\s*type:\s*"spring",\s*stiffness:\s*\d+,\s*damping:\s*\d+,\s*mass:\s*[\d.]+\s*\}\s*\}\}/g, 
                'whileHover={{ scale: 1.05, y: -8, zIndex: 50, transition: { type: "spring", stiffness: 80, damping: 20, mass: 1.2 } }}');

            // Also for SmartSearch which might have it
            // whileHover={{ scale: 1.05, y: -8, zIndex: 50, transition: { type: "spring", stiffness: 180, damping: 25, mass: 0.8 }}}
            content = content.replace(/whileHover=\{\{\s*scale:\s*1\.05,\s*y:\s*-8,\s*zIndex:\s*50,\s*transition:\s*\{\s*type:\s*"spring",\s*stiffness:\s*\d+,\s*damping:\s*\d+,\s*mass:\s*[\d.]+\s*\}\}\}/g, 
                'whileHover={{ scale: 1.05, y: -8, zIndex: 50, transition: { type: "spring", stiffness: 80, damping: 20, mass: 1.2 }}}');

            // For good measure, let's also update whileTap so it doesn't snap back abruptly
            content = content.replace(/whileTap=\{\{\s*scale:\s*0\.98,\s*transition:\s*\{\s*type:\s*"spring",\s*stiffness:\s*\d+,\s*damping:\s*\d+,\s*mass:\s*[\d.]+\s*\}\s*\}\}/g,
                'whileTap={{ scale: 0.98, transition: { type: "spring", stiffness: 100, damping: 20, mass: 1.0 } }}');

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated poster hover in ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(process.cwd(), 'src'));
console.log('Poster hover scales updated!');
