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

            // For social buttons specifically, we can make the hover scale 1.05 and ensure duration is 900ms
            if (fullPath.includes('Developer.tsx') || fullPath.includes('DeveloperPage.tsx')) {
                // Find framer motion hover states for links and increase scale to 1.05
                content = content.replace(/whileHover=\{\{\s*scale:\s*1\.02,\s*transition/g, 'whileHover={{ scale: 1.05, transition');
                
                // Let's also ensure pure CSS social buttons are super smooth
                content = content.replace(/hover:scale-110/g, 'hover:scale-110 hover:-translate-y-1 transition-all duration-[900ms] ease-out');
                content = content.replace(/hover:scale-105/g, 'hover:scale-105 hover:-translate-y-1 transition-all duration-[900ms] ease-out');
            }

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Fixed physics in ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(process.cwd(), 'src'));
console.log('Fixed duplicate mass!');
