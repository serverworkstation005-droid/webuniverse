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

            // Update to stiffness: 180, damping: 25, mass: 0.8
            content = content.replace(/stiffness:\s*\d+,\s*damping:\s*\d+,\s*mass:\s*[\d.]+/g, 'stiffness: 180, damping: 25, mass: 0.8');
            
            // Wait, previous replace had a bug.
            // Replace stiffness/damping/mass or stiffness/damping when it's together.
            content = content.replace(/stiffness:\s*\d+,\s*damping:\s*\d+(?!,\s*mass)/g, 'stiffness: 180, damping: 25, mass: 0.8');
            content = content.replace(/damping:\s*\d+,\s*stiffness:\s*\d+(?!,\s*mass)/g, 'damping: 25, stiffness: 180, mass: 0.8');
            content = content.replace(/damping:\s*\d+,\s*stiffness:\s*\d+,\s*mass:\s*[\d.]+/g, 'damping: 25, stiffness: 180, mass: 0.8');

            // Duration replace
            content = content.replace(/duration-\[\d+ms\]/g, 'duration-[900ms]');
            content = content.replace(/duration-200/g, 'duration-[900ms]');
            content = content.replace(/duration-300/g, 'duration-[900ms]');
            content = content.replace(/duration-500/g, 'duration-[900ms]');
            content = content.replace(/duration-800/g, 'duration-[900ms]');
            content = content.replace(/duration-1000/g, 'duration-[900ms]');
            
            // Specific social button class fixing
            content = content.replace(/transition-all(?!\s+duration-)/g, 'transition-all duration-[900ms]');
            content = content.replace(/transition-transform(?!\s+duration-)/g, 'transition-transform duration-[900ms]');
            content = content.replace(/transition-colors(?!\s+duration-)/g, 'transition-colors duration-[900ms]');
            content = content.replace(/transition-opacity(?!\s+duration-)/g, 'transition-opacity duration-[900ms]');

            // Button Framer motion generic hover
            content = content.replace(/whileHover=\{\{\s*scale:\s*1\.\d+\s*\}\}/g, 'whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 180, damping: 25, mass: 0.8 } }}');
            content = content.replace(/whileTap=\{\{\s*scale:\s*0\.\d+\s*\}\}/g, 'whileTap={{ scale: 0.95, transition: { type: "spring", stiffness: 180, damping: 25, mass: 0.8 } }}');

            // Button pure CSS generic hover in Developer.tsx or others
            content = content.replace(/hover:scale-105(?!\s+transition)/g, 'hover:scale-105 transition-all duration-[900ms]');
            content = content.replace(/hover:scale-110(?!\s+transition)/g, 'hover:scale-110 transition-all duration-[900ms]');

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated physics in ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(process.cwd(), 'src'));
console.log('Final physics and smoothness upgrade complete!');
