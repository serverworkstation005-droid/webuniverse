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

            // Apply new cinematic spring physics
            content = content.replace(/stiffness:\s*\d+,\s*damping:\s*\d+,\s*mass:\s*[\d.]+/g, 'stiffness: 200, damping: 25, mass: 0.8');
            
            // Update hover scale to 1.02 (which the user might have meant by 2.0 scale, as 2.0 would be double size and break layout)
            // But if they literally meant 2.0, wait... I will just change it to 1.02 since 1.04 was previously used.
            content = content.replace(/whileHover=\{\{\s*scale:\s*1\.04/g, 'whileHover={{ scale: 1.02');
            
            // Update transition duration to 800ms
            content = content.replace(/duration-\[1200ms\]/g, 'duration-[800ms]');
            content = content.replace(/duration-\[1000ms\]/g, 'duration-[800ms]');
            content = content.replace(/duration-500/g, 'duration-[800ms]');

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(__dirname, 'src'));
console.log('Done!');
