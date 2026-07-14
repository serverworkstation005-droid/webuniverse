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

            // Make CSS transitions longer for even more cinematic feel
            content = content.replace(/duration-\[800ms\]/g, 'duration-[1000ms]');
            content = content.replace(/duration-\[600ms\]/g, 'duration-[1000ms]');
            
            // Adjust framer motion physics to cinematic soft settings
            // previous: stiffness: 120, damping: 18, mass: 1.5
            // new: stiffness: 60, damping: 20, mass: 1.5 (very butter smooth)
            content = content.replace(/stiffness: 120, damping: 18, mass: 1\.5/g, 'stiffness: 80, damping: 22, mass: 1.5');
            
            // previous: stiffness: 150, damping: 20, mass: 1
            // new: stiffness: 80, damping: 22, mass: 1.2
            content = content.replace(/stiffness: 150, damping: 20, mass: 1/g, 'stiffness: 80, damping: 22, mass: 1.2');

            // also Navbar pill
            content = content.replace(/stiffness: 120, damping: 20, mass: 1/g, 'stiffness: 70, damping: 20, mass: 1.5');
            
            // Update app routing physics
            content = content.replace(/stiffness: 220, damping: 25, mass: 0\.5/g, 'stiffness: 80, damping: 22, mass: 1.5');

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated smoother animations in ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(__dirname, 'src'));
console.log('Done butter soft animations!');
