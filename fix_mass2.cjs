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
            content = content.replace(/mass:\s*[\d.]+,\s*mass:\s*0\.8/g, 'mass: 0.8');
            // If there's any residual like `mass: 1.0, mass: 0.8` etc.
            
            // Also increase duration on CSS buttons (like social buttons) if they aren't framer-motion driven
            // Some are standard CSS classes like hover:scale-105 transition-all
            content = content.replace(/hover:scale-105(?!.*duration)/g, 'hover:scale-105 transition-all duration-[900ms]');
            content = content.replace(/hover:scale-110(?!.*duration)/g, 'hover:scale-110 transition-all duration-[900ms]');
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Fixed physics in ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(process.cwd(), 'src'));
console.log('Fixed duplicate mass!');
