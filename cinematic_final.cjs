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
            content = content.replace(/stiffness:\s*\d+,\s*damping:\s*\d+(?!,\s*mass)/g, 'stiffness: 180, damping: 25, mass: 0.8');

            // Also update any duration-[Xms] or duration-X to 900ms
            content = content.replace(/duration-\[\d+ms\]/g, 'duration-[900ms]');
            // Except for standard ones if we don't want to replace *everything*, but user asked for "arr transition duration 900ms dao" (give 900ms transition duration everywhere)
            content = content.replace(/duration-500/g, 'duration-[900ms]');
            content = content.replace(/duration-800/g, 'duration-[900ms]');
            content = content.replace(/duration-1000/g, 'duration-[900ms]');
            
            // "social button o smooth kore dao" (make social button smooth too)
            // Let's ensure any hover scale on generic buttons has the new physics if it doesn't already
            if (content.includes('FaGithub') || content.includes('Facebook') || content.includes('social') || content.includes('Social') || fullPath.includes('Developer')) {
                // If there are standard CSS transitions that don't have duration explicitly, maybe add it, but it's hard to guess.
                // We'll replace all 'transition-all' or 'transition-transform' with one that has duration-[900ms]
                content = content.replace(/transition-all(?!\s+duration-)/g, 'transition-all duration-[900ms]');
                content = content.replace(/transition-transform(?!\s+duration-)/g, 'transition-transform duration-[900ms]');
                content = content.replace(/transition-colors(?!\s+duration-)/g, 'transition-colors duration-[900ms]');
                content = content.replace(/transition-opacity(?!\s+duration-)/g, 'transition-opacity duration-[900ms]');
                
                // For Framer motion buttons specifically
                content = content.replace(/whileHover=\{\{\s*scale:\s*1\.\d+\s*\}\}/g, 'whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 180, damping: 25, mass: 0.8 } }}');
                content = content.replace(/whileTap=\{\{\s*scale:\s*0\.\d+\s*\}\}/g, 'whileTap={{ scale: 0.95, transition: { type: "spring", stiffness: 180, damping: 25, mass: 0.8 } }}');
            }

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated physics in ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(process.cwd(), 'src'));
console.log('Final physics and smoothness upgrade complete!');
